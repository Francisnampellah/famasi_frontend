import { useState } from "react"
import { InferenceClient } from "@huggingface/inference"
import { formatMedicineUsage } from "@/utils/formatMedicineUsage"

export const useMedicineUsage = () => {
  const [medicineUsage, setMedicineUsage] = useState<string>("")
  const [isLoadingUsage, setIsLoadingUsage] = useState(false)

  const fetchMedicineUsage = async (medicineName: string) => {
    try {
      setIsLoadingUsage(true)
      const client = new InferenceClient(process.env.NEXT_PUBLIC_HUGGINGFACE_TOKEN || "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")
      
      const chatCompletion = await client.chatCompletion({
        provider: "novita",
        model: "deepseek-ai/DeepSeek-V3-0324",
        messages: [
          {
            role: "user",
            content: `What are the common uses and dosage instructions for ${medicineName}? Please provide a brief summary.`,
          },
        ],
      })

      const formattedUsage = formatMedicineUsage(chatCompletion.choices[0].message.content)
      setMedicineUsage(formattedUsage)
    } catch (error) {
      console.error("Error fetching medicine usage:", error)
      setMedicineUsage("Unable to fetch medicine usage information.")
    } finally {
      setIsLoadingUsage(false)
    }
  }

  return {
    medicineUsage,
    isLoadingUsage,
    fetchMedicineUsage
  }
} 