import { useRef } from "react";
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
        watch,
        setValue,
        getValues,
        trigger,
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

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const imageUrl = watch("image");

    const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFileName(file.name);
        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("http://localhost:3000/api/upload", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Fehler beim Upload.");
            }

            const data = await response.json();
            setValue("image", data.url, { shouldValidate: true }); // speichert Pfad in Form
        } catch (error) {
            console.error("Upload-Fehler:", error);
            alert("Bild konnte nicht hochgeladen werden.");
        }
    };

    const onSubmit = async (data: RecipeFormData) => {
        console.log("onSubmit")
        console.log("📤 Sending data:", data);
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

                <div className="grid grid-cols-2 gap-6">
                    <div className="flex-1 space-y-4">
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
                            <Label className="mb-1 block">upload image</Label>

                            <label
                                htmlFor="file-upload"
                                className="inline-block cursor-pointer px-4 py-2 bg-black text-white text-sm rounded hover:bg-blue-700 transition"
                            >
                                📁 Datei auswählen
                            </label>

                            <input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                            />

                            {selectedFileName && (
                                <p className="mt-2 text-sm text-gray-600 italic">{selectedFileName}</p>
                            )}
                        </div>

                    </div>
                    {imageUrl && (
                        <div>
                            <Label className="mb-1 block">preview</Label>
                            <img
                                src={`http://localhost:3000${imageUrl}`}
                                alt="Preview"
                                className="max-h-70 rounded border shadow-sm object-cover"
                            />
                        </div>
                    )}

                </div>


                <div className="flex gap-4">

                    <Controller
                        name="categoryIds"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                            <CollapsibleFieldset title="categories">
                                <div className="flex flex-col gap-2">
                                    {categories.map((cat) => (
                                        <Label key={cat.id} className="flex items-center gap-2">
                                            <Checkbox
                                                checked={field.value?.includes(cat.id)}
                                                onCheckedChange={(checked) => {
                                                    const value = field.value || [];
                                                    if (checked) {
                                                        field.onChange([...value, cat.id]);
                                                    } else {
                                                        field.onChange(value.filter((id: number) => id !== cat.id));
                                                    }
                                                }}
                                            />
                                            {cat.name}
                                        </Label>
                                    ))}
                                </div>
                            </CollapsibleFieldset>
                        )}
                    />

                    <Controller
                        name="tagIds"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                            <CollapsibleFieldset title="tags">
                                <div className="flex flex-col gap-2">
                                    {tags.map((tag) => (
                                        <Label key={tag.id} className="flex items-center gap-2">
                                            <Checkbox
                                                checked={field.value?.includes(tag.id)}
                                                onCheckedChange={(checked) => {
                                                    const value = field.value || [];
                                                    if (checked) {
                                                        field.onChange([...value, tag.id]);
                                                    } else {
                                                        field.onChange(value.filter((id: number) => id !== tag.id));
                                                    }
                                                }}
                                            />
                                            {tag.name}
                                        </Label>
                                    ))}
                                </div>
                            </CollapsibleFieldset>
                        )}
                    />

                    <Controller
                        name="applianceIds"
                        control={control}
                        defaultValue={[]}
                        render={({ field }) => (
                            <CollapsibleFieldset title="appliances">
                                <div className="flex flex-col gap-2">
                                    {appliances.map((app) => (
                                        <Label key={app.id} className="flex items-center gap-2">
                                            <Checkbox
                                                checked={field.value?.includes(app.id)}
                                                onCheckedChange={(checked) => {
                                                    const value = field.value || [];
                                                    if (checked) {
                                                        field.onChange([...value, app.id]);
                                                    } else {
                                                        field.onChange(value.filter((id: number) => id !== app.id));
                                                    }
                                                }}
                                            />
                                            {app.name}
                                        </Label>
                                    ))}
                                </div>
                            </CollapsibleFieldset>
                        )}
                    />

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
        </Card >
    );
}
