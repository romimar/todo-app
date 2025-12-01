import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface ListPaginationProps {
    rowsPerPage: number;
    currentPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
}

const ListPagination = ({
    rowsPerPage,
    currentPage,
    totalItems,
    onPageChange,
}: ListPaginationProps) => {
    const totalPages = Math.max(1, Math.ceil(totalItems / rowsPerPage));
    const isFirstPage = currentPage === 1;
    const isLastPage = currentPage >= totalPages;

    const handlePrevious = () => {
        if (!isFirstPage) {
            onPageChange(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (!isLastPage) {
            onPageChange(currentPage + 1);
        }
    };

    return (
        <Pagination aria-label="Page navigation">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        className={isFirstPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        onClick={handlePrevious}
                    />
                </PaginationItem>
                <PaginationItem>
                    <span className="px-2 py-1">Page {currentPage} of {totalPages}</span>
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext
                        className={isLastPage ? "pointer-events-none opacity-50" : "cursor-pointer"}
                        onClick={handleNext}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}

export default ListPagination;
