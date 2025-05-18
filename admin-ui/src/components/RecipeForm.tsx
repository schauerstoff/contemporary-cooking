import { useForm, Controller } from "react-hook-form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Card } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { CollapsibleFieldset } from "./forms/CollapsibleFieldset"

interface RecipeFormData {
    title: string;
    description?: string;
    image?: string;
    servings: number;
    prepTime: number;
    waitTime: number;
    categoryIds: number[];
    tagIds: number[];
    applianceIds: number[];
}

export default function RecipeForm() {
    const {
        register,
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<RecipeFormData>({
        defaultValues: {
            waitTime: 0,
        },
    });

    const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);


    useEffect(() => {
        if (submitSuccess) {
            const timer = setTimeout(() => setSubmitSuccess(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [submitSuccess]);

    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [tags, setTags] = useState<{ id: number; name: string }[]>([]);
    const [appliances, setAppliances] = useState<{ id: number; name: string }[]>([]);

    useEffect(() => {
        fetch("http://localhost:3000/api/categories").then(res => res.json()).then(setCategories);
        fetch("http://localhost:3000/api/tags").then(res => res.json()).then(setTags);
        fetch("http://localhost:3000/api/appliances").then(res => res.json()).then(setAppliances);
    }, []);

    const onSubmit = async (data: RecipeFormData) => {
        setSubmitError(null);
        setSubmitSuccess(null);
        try {
            const response = await fetch("http://localhost:3000/api/recipes", {
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

            setSubmitSuccess("✅ Rezept erfolgreich gespeichert!");
            reset();
        } catch (err: any) {
            console.error("❌ Fehler beim Speichern:", err);
            setSubmitError(err.message);
        }
    };

    return (
        <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">add recipe</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

                <div>
                    <Label className="mb-1" htmlFor="title">title</Label>
                    <Input id="title" {...register("title", { required: "required" })} />
                    {errors.title && <p className="text-sm text-pink-500">{errors.title.message}</p>}
                </div>

                <div>
                    <Label className="mb-1" htmlFor="description">description</Label>
                    <Input id="description" {...register("description")} />
                </div>

                <div>
                    <Label className="mb-1" htmlFor="image">image URL</Label>
                    <Input id="image" {...register("image")} />
                </div>


                <div className="flex gap-4">
                    <CollapsibleFieldset title="categories">
                        <div className="flex flex-col gap-2">
                            {categories.map((cat) => (
                                <Label key={cat.id} className="flex items-center gap-2">
                                    <Checkbox value={cat.id} {...register("categoryIds")} />
                                    {cat.name}
                                </Label>
                            ))}
                        </div>
                    </CollapsibleFieldset>

                    <CollapsibleFieldset title="tags">
                        <div className="flex flex-col gap-2">
                            {tags.map((tag) => (
                                <Label key={tag.id} className="flex items-center gap-2">
                                    <Checkbox value={tag.id} {...register("tagIds")} />
                                    {tag.name}
                                </Label>
                            ))}
                        </div>
                    </CollapsibleFieldset>

                    <CollapsibleFieldset title="appliances">
                        <div className="flex flex-col gap-2">
                            {appliances.map((app) => (
                                <Label key={app.id} className="flex items-center gap-2">
                                    <Checkbox value={app.id} {...register("applianceIds")} />
                                    {app.name}
                                </Label>
                            ))}
                        </div>
                    </CollapsibleFieldset>

                    <div className="flex flex-col gap-2">
                        <div>
                            <Label className="mb-1">servings</Label>
                            <Input type="number" step="1" {...register("servings", { required: "required", valueAsNumber: true })} />
                            {errors.servings && <p className="text-sm text-pink-500">{errors.servings.message}</p>}
                        </div>

                        <div>
                            <Label className="mb-1">prepTime (min)</Label>
                            <Input type="number" step="1" {...register("prepTime", { required: "required", valueAsNumber: true })} />
                            {errors.prepTime && <p className="text-sm text-pink-500">{errors.prepTime.message}</p>}
                        </div>

                        <div>
                            <Label className="mb-1">waitTime (min)</Label>
                            <Input type="number" step="1" {...register("waitTime", { valueAsNumber: true })} />
                        </div>
                    </div>

                </div>



                <Button type="submit">Rezept speichern</Button>

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
