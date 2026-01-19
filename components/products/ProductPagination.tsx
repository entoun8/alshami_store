import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProductPagination() {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            className="pointer-events-none opacity-50 hover:bg-accent hover:text-accent-foreground"
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            isActive
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            className="hover:bg-primary/10 hover:text-primary border-border"
          >
            2
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#"
            className="hover:bg-primary/10 hover:text-primary border-border"
          >
            3
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href="#"
            className="hover:bg-primary/10 hover:text-primary border-border"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
