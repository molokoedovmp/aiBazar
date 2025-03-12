"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X } from "lucide-react"
import Image from "next/image"
import { useEdgeStore } from "@/lib/edgestore"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export const ImageUpload = ({
  value,
  onChange,
  label = "Загрузить изображение"
}: ImageUploadProps) => {
  const [isUploading, setIsUploading] = useState(false)
  const { edgestore } = useEdgeStore()

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setIsUploading(true)
      
      // Загрузка файла в EdgeStore
      const res = await edgestore.publicFiles.upload({
        file,
        options: {
          replaceTargetUrl: value,
        },
      })
      
      onChange(res.url)
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    onChange("")
  }

  return (
    <div className="flex flex-col gap-2">
      {value ? (
        <div className="relative w-full h-40 overflow-hidden rounded-md">
          <div className="absolute top-2 right-2 z-10">
            <Button
              type="button"
              variant="destructive"
              size="icon"
              onClick={handleRemove}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Image
            src={value}
            alt="Uploaded image"
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                {isUploading ? "Загрузка..." : label}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  )
} 