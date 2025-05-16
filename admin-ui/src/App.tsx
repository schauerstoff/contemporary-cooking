import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import IngredientForm from "./components/IngredientForm";
// import RecipeForm from "./components/RecipeForm"; // später

function App() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin UI</h1>

      <Tabs defaultValue="ingredient" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="ingredient">Zutat hinzufügen</TabsTrigger>
          <TabsTrigger value="recipe">Rezept hinzufügen</TabsTrigger>
        </TabsList>

        <TabsContent value="ingredient">
          <IngredientForm />
        </TabsContent>

        <TabsContent value="recipe">
          {/* <RecipeForm /> */}
          <div className="p-4 border rounded text-gray-500">
            Rezeptformular coming soon.
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default App;