import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { ApiSettingsDialog } from "@/components/ui/api-settings-dialog"

export function FloatingApiSettings() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        size="icon"
        className="fixed bottom-4 right-4 h-12 w-12 rounded-full shadow-lg z-50"
        title="Configuration API"
      >
        <Settings className="h-5 w-5" />
      </Button>
      <ApiSettingsDialog open={isOpen} onOpenChange={setIsOpen} />
    </>
  )
}
