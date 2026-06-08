import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type Props = {
  currentPage: number
  totalPages: number
  basePath: string
}

export function Pagination({ currentPage, totalPages, basePath }: Props) {
  if (totalPages <= 1) return null

  return (
    <nav className="flex items-center justify-center gap-2 mt-10">
      {currentPage > 1 && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`${basePath}?page=${currentPage - 1}`}>
            <ChevronLeft className="size-4 mr-0.5" />
            Previous
          </Link>
        </Button>
      )}

      <span className="text-sm text-muted-foreground px-4">
        Page {currentPage} of {totalPages}
      </span>

      {currentPage < totalPages && (
        <Button variant="outline" size="sm" asChild>
          <Link href={`${basePath}?page=${currentPage + 1}`}>
            Next
            <ChevronRight className="size-4 ml-0.5" />
          </Link>
        </Button>
      )}
    </nav>
  )
}
