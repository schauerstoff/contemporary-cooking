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
        control,
        formState: { errors },
    } = useForm<IngredientFormData & { productUnit: "g" | "ml" } & { kcalPer100Unit: number } & { carbsPer100Unit: number } & { fatPer100Unit: number } & { proteinPer100Unit: number }>({
        defaultValues: {
            seasons: [],
            productUnit: "g",
            glutenFree: false,
            nutFree: false,
            soyFree: false,
        }
    });

    const [ingredientTypes, setIngredientTypes] = useState<string[]>([]);
    const [seasonMonths, setSeasonMonths] = useState<{ id: number; name: string }[]>([]);

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
    const kcalPer100Unit = watch("kcalPer100Unit");
    const carbsPer100Unit = watch("carbsPer100Unit");
    const fatPer100Unit = watch("fatPer100Unit");
    const proteinPer100Unit = watch("proteinPer100Unit");

    if (selectedType !== "FRESH") {
        setValue("seasons", []);
    }

    const onSubmit = async (data: IngredientFormData) => {
        console.log(typeof kcalPer100Unit);
        // conversions
        if (productUnit === "g") {
            data.pricePer100g = ((data.productPrice / data.productAmount) * 100);
            data.kcalPer100g = kcalPer100Unit;
            data.carbsPer100g = carbsPer100Unit;
            data.fatPer100g = fatPer100Unit;
            data.proteinPer100g = proteinPer100Unit;
            console.log(typeof data.proteinPer100g);
        } else {
            data.pricePer100g = ((data.productPrice / data.productAmount * data.density) * 100);
            data.kcalPer100g = kcalPer100Unit / data.density;
            data.carbsPer100g = carbsPer100Unit / data.density;
            data.fatPer100g = fatPer100Unit / data.density;
            data.proteinPer100g = proteinPer100Unit / data.density;
        }

        console.log("Neue Zutat:", data);
        await fetch("http://localhost:3000/api/ingredients", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        alert("Zutat gespeichert!");
    };


    return (
        <Card className="p-6 max-w-xl mx-auto space-y-4">
            <h2 className="text-xl font-semibold">Zutat hinzufügen</h2>

            <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                <div>
                    <Label htmlFor="name">name</Label>
                    <Input id="name" {...register("name", { required: true })} />
                    {errors.name && (
                        <p className="text-sm text-red-500">required field</p>
                    )}
                </div>

                <div>
                    <Label>type</Label>
                    <Select
                        onValueChange={(value) => setValue("type", value, { shouldValidate: true })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="– bitte wählen –" />
                        </SelectTrigger>
                        <SelectContent>
                            {ingredientTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.type && (
                        <p className="text-sm text-red-500">required field</p>
                    )}
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

                <div>
                    <Label htmlFor="density">density (g/ml)</Label>
                    <Input
                        id="density"
                        type="number"
                        step="any"
                        {...register("density", { required: true, valueAsNumber: true })}
                    />
                    {errors.type && (
                        <p className="text-sm text-red-500">required field</p>
                    )}
                </div>

                <Controller
                    name="productUnit"
                    control={control}
                    render={({ field }) => (
                        <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="flex gap-4"
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


                <hr />

                <div>
                    <Label>product size in {productUnit}</Label>
                    <Input type="number" step="any" {...register("productAmount", { required: true, min: 1, valueAsNumber: true })} />
                    {errors.type && (
                        <p className="text-sm text-red-500">required field</p>
                    )}
                </div>


                <div>
                    <Label>product price in €</Label>
                    <Input type="number" step="any" {...register("productPrice", { required: true, min: 0.01, valueAsNumber: true })} />
                </div>

                <hr />

                <div>
                    <Label>kcal / 100{productUnit}</Label>
                    <Input type="number" step="any" {...register("kcalPer100Unit", { required: true, valueAsNumber: true })} />
                </div>
                <div>
                    <Label>carbs / 100{productUnit}</Label>
                    <Input type="number" step="any" {...register("carbsPer100Unit", { required: true, valueAsNumber: true })} />
                </div>
                <div>
                    <Label>fat / 100{productUnit}</Label>
                    <Input type="number" step="any" {...register("fatPer100Unit", { required: true, valueAsNumber: true })} />
                </div>
                <div>
                    <Label>protein / 100{productUnit}</Label>
                    <Input type="number" step="any" {...register("proteinPer100Unit", { required: true, valueAsNumber: true })} />
                </div>

                <hr />

                <div className="flex flex-col gap-2">
                    <Controller
                        name="glutenFree"
                        control={control}
                        render={({ field }) => (
                            <Label className="flex items-center gap-2">
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                gluten-free
                            </Label>
                        )}
                    />
                    <Controller
                        name="nutFree"
                        control={control}
                        render={({ field }) => (
                            <Label className="flex items-center gap-2">
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                nut-free
                            </Label>
                        )}
                    />
                    <Controller
                        name="soyFree"
                        control={control}
                        render={({ field }) => (
                            <Label className="flex items-center gap-2">
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                soy-free
                            </Label>
                        )}
                    />
                </div>

                <Button type="submit">Zutat speichern</Button>
            </form>
        </Card>
    );
}