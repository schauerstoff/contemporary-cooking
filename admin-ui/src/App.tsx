import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import IngredientForm from "./components/IngredientForm";
// import RecipeForm from "./components/RecipeForm"; 
import HealthIndicator from "./components/HealthIndicator";
import DarkModeToggle from "./components/darkmodeToggle"

function App() {
  return (
    <div>

      <div className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 shadow-sm bg-white dark:bg-gray-900 dark:text-white">
        <h1 className="text-xl tracking-wide flex items-center gap-2">
          <span className="text-sm text-gray-800 dark:text-gray-300">✧･ﾟ: *✧</span>
          <span className="font-semibold">𝒄𝒐𝒏𝒕𝒆𝒎𝒑𝒐𝒓𝒂𝒓𝒚 𝒄𝒐𝒐𝒌𝒊𝒏𝒈 𝒂𝒅𝒎𝒊𝒏</span>
          <span className="text-sm text-gray-800 dark:text-gray-300">✧ *:･ﾟ✧</span>
        </h1>
        <div className="flex items-center gap-4">

          <HealthIndicator />
          <DarkModeToggle />
        </div>
      </div>

      <div className="p-8 max-w-4xl mx-auto">


        <Tabs defaultValue="ingredient" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="ingredient">Zutat hinzufügen</TabsTrigger>
            <TabsTrigger value="recipe">Rezept hinzufügen</TabsTrigger>
          </TabsList>

          <TabsContent value="ingredient">
            <IngredientForm />
          </TabsContent>

          <TabsContent value="recipe">
            <div className="p-4 border rounded text-gray-500">
              Rezeptformular coming soon.
            </div>
          </TabsContent>
        </Tabs>
      </div></div>
  );
}

export default App;