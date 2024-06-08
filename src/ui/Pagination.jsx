import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import styled from "styled-components";
import PropTypes from "prop-types";
import { useSearchParams } from "react-router-dom";
import { PAGE_SIZE } from "../utils/constance";
const StyledPagination = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const P = styled.p`
  font-size: 1.4rem;
  margin-left: 0.8rem;

  & span {
    font-weight: 600;
  }
`;

const Buttons = styled.div`
  display: flex;
  gap: 0.6rem;
`;

const PaginationButton = styled.button`
  background-color: ${(props) =>
    props.active ? " var(--color-brand-600)" : "var(--color-grey-50)"};
  color: ${(props) => (props.active ? " var(--color-brand-50)" : "inherit")};
  border: none;
  border-radius: var(--border-radius-sm);
  font-weight: 500;
  font-size: 1.4rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  transition: all 0.3s;

  &:has(span:last-child) {
    padding-left: 0.4rem;
  }

  &:has(span:first-child) {
    padding-right: 0.4rem;
  }

  & svg {
    height: 1.8rem;
    width: 1.8rem;
  }

  &:hover:not(:disabled) {
    background-color: var(--color-brand-600);
    color: var(--color-brand-50);
  }
`;

export default function Pagination({ count }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  /*
  /////////////////////////////////////[Page Count Logic]
  1. pageCount is the total number of pages we're gonna have
  2. PAGE_SIZE the numbers of data we wanna show in one pagination page
  3. count is the whole data we receive from database
  
  So for example, if count = 24, and we want the PAGE_SIZE to be 10, then
  the pageCount will be = 24 / 10 = 2.4, then use Math.ceil to round up to 3
  resulting we'll have 3 pages
  */

  const pageCount = Math.ceil(count / PAGE_SIZE);

  if (pageCount <= 1) return;

  /*
  /////////////////////////////////////[Next and previous Page Logic]
  1. Next contains a condition, if the currentPage === the pageCount then it returns currentPage, else it'll return currentPage + 1
  2. Prev contains a condition, if the currentPage === 1, then it returns currentPage, else it'll return currentPage - 1
  3. Then it uses the searchParams to set the new page value
  4. Finally, it uses the setSearchParams with the value of searchParams to make the changes

  */

  function nextPage() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;
    searchParams.set("page", next);
    setSearchParams(searchParams);
  }

  function prevPage() {
    const previous = currentPage === 1 ? currentPage : currentPage - 1;
    searchParams.set("page", previous);
    setSearchParams(searchParams);
  }

  return (
    <StyledPagination>
      <P>
        Showing <span>{(currentPage - 1) * PAGE_SIZE + 1}</span> to{" "}
        <span>
          {currentPage === pageCount ? count : currentPage * PAGE_SIZE}
        </span>{" "}
        of <span>{count} results</span>
      </P>
      <Buttons>
        <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
          <HiChevronLeft />
          <span>Previous</span>
        </PaginationButton>
        <PaginationButton
          onClick={nextPage}
          disabled={currentPage === pageCount}
        >
          <span>Next</span>
          <HiChevronRight />
        </PaginationButton>
      </Buttons>
    </StyledPagination>
  );
}

Pagination.propTypes = {
  count: PropTypes.number,
};
