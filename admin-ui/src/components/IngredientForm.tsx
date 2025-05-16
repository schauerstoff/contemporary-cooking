import { useForm } from "react-hook-form";

type IngredientType = "BASIC" | "STAPLE" | "FRESH";
type Season =
    | "JAN" | "FEB" | "MAR" | "APR" | "MAY" | "JUN"
    | "JUL" | "AUG" | "SEP" | "OCT" | "NOV" | "DEC";

type IngredientFormData = {
    name: string;
    density: number;
    season: Season[];
    type: IngredientType;
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
        formState: { errors },
    } = useForm<IngredientFormData & { productUnit: "g" | "ml" } & { kcalPer100Unit: number } & { carbsPer100Unit: number } & { fatPer100Unit: number } & { proteinPer100Unit: number }>({
        defaultValues: { season: [], productUnit: "g", }
    });

    const selectedType = watch("type")
    const productUnit = watch("productUnit");
    const kcalPer100Unit = watch("kcalPer100Unit");
    const carbsPer100Unit = watch("carbsPer100Unit");
    const fatPer100Unit = watch("fatPer100Unit");
    const proteinPer100Unit = watch("proteinPer100Unit");

    if (selectedType !== "FRESH") {
        setValue("season", []);
    }

    const onSubmit = async (data: IngredientFormData) => {
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

        console.log("Neue Zutat:", data);
        // TODO -> Backend
        alert("Zutat gespeichert!");
    };

    const allSeasons: Season[] = [
        "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
        "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"
    ];


    return (
        <form onSubmit={handleSubmit(onSubmit)} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Zutat hinzufügen</h2>

            <label>
                name
                <input {...register("name", { required: true })} />
                {errors.name && <span style={{ color: "red" }}>Pflichtfeld</span>}
            </label>

            <label>
                type
                <select {...register("type", { required: true })}>
                    <option value="">– bitte wählen –</option>
                    <option value="BASIC">basic</option>
                    <option value="STAPLE">staple</option>
                    <option value="FRESH">fresh</option>
                </select>
                {errors.type && <span style={{ color: "red" }}>Pflichtfeld</span>}
            </label>

            {selectedType === "FRESH" && (
                <fieldset>
                    <legend>season</legend>
                    {allSeasons.map(month => (
                        <label key={month} style={{ display: "inline-block", marginRight: "1rem" }}>
                            <input
                                type="checkbox"
                                value={month}
                                {...register("season")}
                            />
                            {month}
                        </label>
                    ))}
                </fieldset>
            )}

            <label>
                density (g/ml)
                <input type="number" step="any" {...register("density", { required: true })} />
                {errors.name && <span style={{ color: "red" }}>Pflichtfeld</span>}
            </label>

            <fieldset>
                <legend>unit</legend>
                <label>
                    <input
                        type="radio"
                        value="g"
                        {...register("productUnit", { required: true })}
                    />
                    grams (g)
                </label>

                <label style={{ marginLeft: "1rem" }}>
                    <input
                        type="radio"
                        value="ml"
                        {...register("productUnit", { required: true })}
                    />
                    milliliter (ml)
                </label>
                {errors.productUnit && (
                    <span style={{ color: "red" }}>Bitte eine Einheit wählen</span>
                )}
            </fieldset>

            <hr />

            <label>
                product size in / 100{productUnit}
                <input
                    type="number"
                    step="any"
                    {...register("productAmount", { required: true, min: 1 })}
                />
                {errors.productAmount && <span style={{ color: "red" }}>Pflichtfeld</span>}
            </label>

            <label>
                product price in €
                <input
                    type="number"
                    step="any"
                    {...register("productPrice", { required: true, min: 0.01 })}
                />
                {errors.productPrice && <span style={{ color: "red" }}>Pflichtfeld</span>}
            </label>

            <label>
                kcal / 100{productUnit}
                <input type="number" step="any" {...register("kcalPer100Unit", { required: true })} />
                {errors.name && <span style={{ color: "red" }}>Pflichtfeld</span>}
            </label>

            <label>
                carbs / 100{productUnit}
                <input type="number" step="any" {...register("carbsPer100Unit", { required: true })} />
                {errors.name && <span style={{ color: "red" }}>Pflichtfeld</span>}
            </label>

            <label>
                fat / 100{productUnit}
                <input type="number" step="any" {...register("fatPer100Unit", { required: true })} />
                {errors.name && <span style={{ color: "red" }}>Pflichtfeld</span>}
            </label>

            <label>
                protein / 100{productUnit}
                <input type="number" step="any" {...register("proteinPer100Unit", { required: true })} />
                {errors.name && <span style={{ color: "red" }}>Pflichtfeld</span>}
            </label>

            <label>
                <input type="checkbox" {...register("glutenFree")} />
                gluten-free
                {errors.name && <span style={{ color: "red" }}>Pflichtfeld</span>}
            </label>

            <label>
                <input type="checkbox" {...register("nutFree")} />
                nut-free
                {errors.name && <span style={{ color: "red" }}>Pflichtfeld</span>}
            </label>

            <label>
                <input type="checkbox" {...register("soyFree")} />
                soy-free
            </label>

            <button type="submit">Zutat speichern</button>
        </form>
    );
}