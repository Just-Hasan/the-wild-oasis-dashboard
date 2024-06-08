import styled from "styled-components";
import PropTypes from "prop-types";
import Tag from "../../ui/Tag";
import { Flag } from "../../ui/Flag";
import Button from "../../ui/Button";
import { Link } from "react-router-dom";
import { useCheckout } from "./useCheckout";
const StyledTodayItem = styled.li`
  display: grid;
  grid-template-columns: 9rem 2rem 1fr 7rem 9rem;
  gap: 1.2rem;
  align-items: center;
  font-size: 1.4rem;
  padding: 0.8rem 1.6rem;
  border-bottom: 1px solid var(--color-grey-100);
  border-radius: 0.8rem;
  &:hover {
    background-color: var(--color-grey-200);
  }

  &:first-child {
    border-top: 1px solid var(--color-grey-100);
  }
`;

const Guest = styled.div`
  font-weight: 500;
`;

export default function TodayItem({ activity }) {
  const { id, status, guests, numNights } = activity;
  const { checkout, isCheckingOut } = useCheckout();
  return (
    <StyledTodayItem>
      {status === "unconfirmed" && <Tag type="green">Arriving</Tag>}
      {status === "checked-in" && <Tag type="blue">Departing</Tag>}
      <Flag src={guests.countryFlag} alt={`Flag of ${guests.country}`}></Flag>
      <Guest>{guests.fullName}</Guest>
      <div>{numNights} nights</div>
      {status === "unconfirmed" && (
        <Button
          sizes="small"
          variations="primary"
          as={Link}
          to={`/checkin/${id}`}
        >
          Check in
        </Button>
      )}
      {status === "checked-in" && (
        <Button
          disabled={isCheckingOut}
          sizes="small"
          variations="primary"
          onClick={() => checkout(id)}
        >
          Check Out
        </Button>
      )}
    </StyledTodayItem>
  );
}

TodayItem.propTypes = {
  activity: PropTypes.object,
};
