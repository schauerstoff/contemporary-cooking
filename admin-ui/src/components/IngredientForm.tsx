import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Checkbox } from "./ui/checkbox";
import { Card } from "@/components/ui/card";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

type IngredientFormData = {
    name: string;
    density: number;
    seasons: number[];
    type: string;
    productAmount: number;
    productPrice: number;
    pricePer100g: number;
    kcalPer100g: number;
    carbsPer100g: number;
    fatPer100g: number;
    proteinPer100g: number;
    glutenFree: boolean;
    nutFree: boolean;
    soyFree: boolean;
};

export default function IngredientForm() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        trigger,
        control,
        reset,
        formState: { errors },
    } = useForm<IngredientFormData & { productUnit: "g" | "ml" } & { kcalPer100Unit: number } & { carbsPer100Unit: number } & { fatPer100Unit: number } & { proteinPer100Unit: number }>({
        defaultValues: {
            seasons: [],
            productUnit: "g"
        }
    });

    const [ingredientTypes, setIngredientTypes] = useState<string[]>([]);
    const [seasonMonths, setSeasonMonths] = useState<{ id: number; name: string }[]>([]);

    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);
    useEffect(() => {
        if (submitSuccess) {
            const timer = setTimeout(() => {
                setSubmitSuccess(null);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [submitSuccess]);

    useEffect(() => {
        fetch("http://localhost:3000/api/enums/ingredient-type")
            .then(res => res.json())
            .then(setIngredientTypes);

        fetch("http://localhost:3000/api/season-months")
            .then(res => res.json())
            .then(setSeasonMonths);
    }, []);

    const selectedType = watch("type")
    const productUnit = watch("productUnit");
    const density = watch("density")
    const productPrice = watch("productPrice");
    const productAmount = watch("productAmount");
    const kcalPer100Unit = watch("kcalPer100Unit");
    const carbsPer100Unit = watch("carbsPer100Unit");
    const fatPer100Unit = watch("fatPer100Unit");
    const proteinPer100Unit = watch("proteinPer100Unit");

    const calculatedPricePer100g =
        productPrice && productAmount
            ? productUnit === "g"
                ? (productPrice / productAmount) * 100
                : density
                    ? (productPrice / (productAmount * density)) * 100
                    : undefined
            : undefined;

    if (selectedType !== "FRESH") {
        setValue("seasons", []);
    }

    const onSubmit = async (data: IngredientFormData) => {
        setSubmitError(null);
        setSubmitSuccess(null);

        if (!data.productAmount || data.productAmount <= 0) {
            alert("Bitte eine gültige Packungsgröße (> 0) eingeben.");
            return;
        }

        if (data.productPrice < 0) {
            alert("Der Preis darf nicht negativ sein.");
            return;
        }

        // conversions
        if (productUnit === "g") {
            data.pricePer100g = ((data.productPrice / data.productAmount) * 100);
            data.kcalPer100g = kcalPer100Unit;
            data.carbsPer100g = carbsPer100Unit;
            data.fatPer100g = fatPer100Unit;
            data.proteinPer100g = proteinPer100Unit;
        } else {
            data.pricePer100g = ((data.productPrice / data.productAmount * data.density) * 100);
            data.kcalPer100g = kcalPer100Unit / data.density;
            data.carbsPer100g = carbsPer100Unit / data.density;
            data.fatPer100g = fatPer100Unit / data.density;
            data.proteinPer100g = proteinPer100Unit / data.density;
        }

        try {
            const response = await fetch("http://localhost:3000/api/ingredients", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error?.message || "Unbekannter Fehler beim Speichern.");
            }
            setSubmitSuccess("✅ Zutat erfolgreich gespeichert!");
            reset({
                seasons: [],
                productUnit: "g",
                glutenFree: false,
                nutFree: false,
                soyFree: false,
                type: "",
            });

        } catch (err: any) {
            console.error("❌ Fehler beim Speichern:", err);
            setSubmitError(err.message);
        }
    };


    return (
        // TODO Refactor: Label + Input Component to new component
        <Card className="p-6  space-y-4">
            <h2 className="text-xl font-semibold">add ingredient</h2>
            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                <div className="flex gap-4">
                    <div className="w-1/2">
                        <Label className="mb-1" htmlFor="name">name</Label>
                        <Input id="name" {...register("name", { required: "required" })} />
                        {errors.name?.message && (
                            <p className="text-sm text-pink-500">{errors.name.message}</p>
                        )}
                    </div>

                    <div className="w-1/2">
                        <div className="w-1/2">
                            <Label className="mb-3 block">type</Label>

                            <Controller
                                name="type"
                                control={control}
                                rules={{ required: "required" }}
                                render={({ field }) => (
                                    <RadioGroup
                                        className="flex gap-4"
                                        value={field.value ?? ""}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            trigger("type");
                                        }}
                                    >
                                        {ingredientTypes.map((type) => (
                                            <Label key={type} className="flex items-center gap-2">
                                                <RadioGroupItem value={type} />
                                                {type}
                                            </Label>
                                        ))}
                                    </RadioGroup>
                                )}
                            />

                            {errors.type && (
                                <p className="text-sm text-pink-500">{errors.type.message}</p>
                            )}
                        </div>

                    </div>
                </div>

                {selectedType === "FRESH" && (
                    <fieldset className="border p-3 rounded">
                        <legend className="font-medium">season</legend>
                        <div className="grid grid-cols-3 gap-2">
                            {seasonMonths.map((month) => (
                                <Label key={month.id} className="flex items-center gap-2">
                                    <Checkbox value={month.id} {...register("seasons")} />
                                    {month.name}
                                </Label>
                            ))}
                        </div>
                    </fieldset>
                )}

                <hr />

                <div className="grid grid-cols-2 gap-6 items-start">

                    <div>
                        <Label className="mb-3">unit</Label>
                        <Controller
                            name="productUnit"
                            control={control}
                            render={({ field }) => (
                                <RadioGroup
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    className="flex gap-4 mt-1"
                                >
                                    <Label className="flex items-center gap-2">
                                        <RadioGroupItem value="g" /> grams (g)
                                    </Label>
                                    <Label className="flex items-center gap-2">
                                        <RadioGroupItem value="ml" /> milliliter (ml)
                                    </Label>
                                </RadioGroup>
                            )}
                        />
                        {errors.productUnit && (
                            <p className="text-sm text-pink-500">required field</p>
                        )}
                    </div>

                    <div>
                        <Label className="mb-1" htmlFor="density">density (g/ml)</Label>
                        <Input
                            id="density"
                            type="number"
                            step="any"
                            {...register("density", { required: "required", valueAsNumber: true })}
                        />
                        {errors.density?.message && (
                            <p className="text-sm text-pink-500">{errors.density.message}</p>
                        )}
                    </div>
                </div>

                <hr />

                <div className="grid grid-cols-3 gap-6 items-end">
                    <div>
                        <Label className="mb-1">product price in €</Label>
                        <Input
                            type="number"
                            step="any"
                            {...register("productPrice", {
                                required: "required",
                                min: { value: 0, message: "must be ≥ 0" },
                                valueAsNumber: true,
                                validate: (value) =>
                                    !isNaN(value) ? true : "Der Wert muss eine gültige Zahl sein",
                            })}
                        />
                        {errors.productPrice?.message && (
                            <p className="text-sm text-pink-500">{errors.productPrice.message}</p>
                        )}
                    </div>

                    <div>
                        <Label className="mb-1">product size in {productUnit}</Label>
                        <Input
                            type="number"
                            step="any"
                            {...register("productAmount", {
                                required: "required",
                                min: { value: 1, message: "must be > 0" },
                                valueAsNumber: true,
                            })}
                        />
                        {errors.productAmount?.message && (
                            <p className="text-sm text-pink-500">{errors.productAmount.message}</p>
                        )}
                    </div>

                    <div>
                        <Label className="mb-1">price per 100g</Label>
                        <p className="text-gray-700 dark:text-gray-300 font-medium">
                            {calculatedPricePer100g?.toFixed(2) ?? "-"} €
                        </p>
                    </div>
                </div>
                <hr />

                <div className="grid grid-cols-2 gap-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label className="mb-1">kcal / 100{productUnit}</Label>
                            <Input
                                type="number"
                                step="any"
                                {...register("kcalPer100Unit", {
                                    required: "required", min: {
                                        value: 0,
                                        message: "must be >= 0",
                                    }, valueAsNumber: true
                                })}
                            />
                            {errors.kcalPer100Unit?.message && (
                                <p className="text-sm text-pink-500">{errors.kcalPer100Unit.message}</p>
                            )}
                        </div>
                        <div>
                            <Label className="mb-1">carbs / 100{productUnit}</Label>
                            <Input
                                type="number"
                                step="any"
                                {...register("carbsPer100Unit", {
                                    required: "required", min: {
                                        value: 0,
                                        message: "must be >= 0",
                                    }, valueAsNumber: true
                                })}
                            />
                            {errors.carbsPer100Unit?.message && (
                                <p className="text-sm text-pink-500">{errors.carbsPer100Unit.message}</p>
                            )}
                        </div>
                        <div>
                            <Label className="mb-1">fat / 100{productUnit}</Label>
                            <Input
                                type="number"
                                step="any"
                                {...register("fatPer100Unit", {
                                    required: "required", min: {
                                        value: 0,
                                        message: "must be >= 0",
                                    }, valueAsNumber: true
                                })}
                            />
                            {errors.fatPer100Unit?.message && (
                                <p className="text-sm text-pink-500">{errors.fatPer100Unit.message}</p>
                            )}
                        </div>
                        <div>
                            <Label className="mb-1">protein / 100{productUnit}</Label>
                            <Input
                                type="number"
                                step="any"
                                {...register("proteinPer100Unit", {
                                    required: "required", min: {
                                        value: 0,
                                        message: "must be >= 0",
                                    }, valueAsNumber: true
                                })}
                            />
                            {errors.proteinPer100Unit?.message && (
                                <p className="text-sm text-pink-500">{errors.proteinPer100Unit.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 justify-start pt-1">
                        <Controller
                            name="glutenFree"
                            control={control}
                            rules={{
                                validate: (v) =>
                                    v === true || v === false ? true : "required",
                            }}
                            render={({ field }) => (
                                <div>
                                    <Label className="block mb-1">gluten free?</Label>
                                    <RadioGroup
                                        value={field.value?.toString() ?? ""}
                                        onValueChange={(value) => field.onChange(value === "true")}
                                        className="flex gap-4"
                                    >
                                        <Label className="flex items-center gap-2">
                                            <RadioGroupItem value="true" /> Ja
                                        </Label>
                                        <Label className="flex items-center gap-2">
                                            <RadioGroupItem value="false" /> Nein
                                        </Label>
                                    </RadioGroup>
                                    {errors.glutenFree && (
                                        <p className="text-sm text-pink-500">{errors.glutenFree.message}</p>
                                    )}
                                </div>
                            )}
                        />

                        <Controller
                            name="nutFree"
                            control={control}
                            rules={{
                                validate: (v) =>
                                    v === true || v === false ? true : "required",
                            }}
                            render={({ field }) => (
                                <div>
                                    <Label className="block mb-3">nutfree?</Label>
                                    <RadioGroup
                                        value={field.value?.toString() ?? ""}
                                        onValueChange={(value) => field.onChange(value === "true")}
                                        className="flex gap-4"
                                    >
                                        <Label className="flex items-center gap-2">
                                            <RadioGroupItem value="true" /> Ja
                                        </Label>
                                        <Label className="flex items-center gap-2">
                                            <RadioGroupItem value="false" /> Nein
                                        </Label>
                                    </RadioGroup>
                                    {errors.nutFree && (
                                        <p className="text-sm text-pink-500">{errors.nutFree.message}</p>
                                    )}
                                </div>
                            )}
                        />

                        <Controller
                            name="soyFree"
                            control={control}
                            rules={{
                                validate: (v) =>
                                    v === true || v === false ? true : "required",
                            }}
                            render={({ field }) => (
                                <div>
                                    <Label className="block mb-1">soy free?</Label>
                                    <RadioGroup
                                        value={field.value?.toString() ?? ""}
                                        onValueChange={(value) => field.onChange(value === "true")}
                                        className="flex gap-4"
                                    >
                                        <Label className="flex items-center gap-2">
                                            <RadioGroupItem value="true" /> Ja
                                        </Label>
                                        <Label className="flex items-center gap-2">
                                            <RadioGroupItem value="false" /> Nein
                                        </Label>
                                    </RadioGroup>
                                    {errors.soyFree && (
                                        <p className="text-sm text-pink-500">{errors.soyFree.message}</p>
                                    )}
                                </div>
                            )}
                        />



                    </div>
                </div>

                <Button type="submit">Zutat speichern</Button>
                {submitSuccess && (
                    <div className="mt-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded">
                        {submitSuccess}
                    </div>
                )}

                {submitError && (
                    <div className="p-4 bg-pink-100 text-pink-700 border border-pink-300 rounded">
                        <strong>Fehler:</strong> {submitError}
                    </div>
                )}
            </form>
        </Card>
    );
}