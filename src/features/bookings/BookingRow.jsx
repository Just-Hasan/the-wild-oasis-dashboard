import styled from "styled-components";
import { format, isToday } from "date-fns";
import Tag from "../../ui/Tag";
import Table from "../../ui/Table";

import { formatCurrency } from "../../utils/helpers";
import { formatDistanceFromNow } from "../../utils/helpers";
import PropTypes from "prop-types";
import Menus from "../../ui/Menus";
import {
  HiArrowDownOnSquare,
  HiArrowUpOnSquare,
  HiEye,
  HiTrash,
} from "react-icons/hi2";
import { useLocation, useNavigate } from "react-router-dom";
import { useCheckout } from "../check-in-out/useCheckout";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteBooking } from "./useDeleteBooking";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

export default function BookingRow({ booking = {} }) {
  const navigate = useNavigate();
  const { checkout } = useCheckout();
  const { pathname, search } = useLocation();
  const redirect = pathname + search;
  const {
    id: bookingId = "",
    cabins: { name } = {},
    guests: { fullName, email } = {},
    startDate = "",
    endDate = "",
    status = "",
    totalPrice = 0,
    numNights = 0,
  } = booking;

  const { deleteBooking, isDeletingBooking } = useDeleteBooking();

  const statusToTagName = {
    "unconfirmed": "blue", //prettier-ignore
    "checked-in": "green",
    "checked-out": "silver",
  };

  return (
    <Table.Row>
      <Cabin>{name}</Cabin>

      <Stacked>
        <span>{fullName}</span>
        <span>{email}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(startDate))
            ? "Today"
            : formatDistanceFromNow(startDate)}{" "}
          &rarr; {numNights} night stay
        </span>
        <span>
          {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
          {format(new Date(endDate), "MMM dd yyyy")}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status.toLowerCase()]}>
        {status.replace("-", " ")}
      </Tag>

      <Amount>{formatCurrency(totalPrice)}</Amount>

      <Menus.Menu>
        <Modal>
          <Menus.Toggle id={bookingId} />
          <Menus.List id={bookingId}>
            <Menus.Button
              icon={<HiEye />}
              onClick={() => {
                navigate(`${bookingId}`);
              }}
            >
              See Details
            </Menus.Button>
            {status === "unconfirmed" && (
              <Menus.Button
                onClick={() => navigate(`/checkin/${bookingId}`)}
                icon={<HiArrowDownOnSquare />}
              >
                Check in
              </Menus.Button>
            )}

            {status === "checked-in" && (
              <Menus.Button
                onClick={() => {
                  checkout(bookingId);
                }}
                icon={<HiArrowUpOnSquare />}
              >
                Check out
              </Menus.Button>
            )}

            {/*  */}
            <Modal.Open
              opens="delete-booking"
              renderButton={(opens) => (
                <Menus.Button onClick={opens} icon={<HiTrash />}>
                  Delete
                </Menus.Button>
              )}
            />
          </Menus.List>
          <Modal.Window
            name="delete-booking"
            renderForm={(close) => (
              <ConfirmDelete
                resourceName={booking}
                onConfirm={() => deleteBooking({ bookingId, redirect })}
                onClose={close}
                disabled={isDeletingBooking}
              />
            )}
          />
        </Modal>
      </Menus.Menu>
    </Table.Row>
  );
}

BookingRow.propTypes = {
  booking: PropTypes.object,
};
