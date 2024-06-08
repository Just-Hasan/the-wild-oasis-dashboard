import styled from "styled-components";
import BookingDataBox from "./BookingDataBox";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag";
import ButtonGroup from "../../ui/ButtonGroup";
import Button from "../../ui/Button";
import ButtonText from "../../ui/ButtonText";
import Empty from "../../ui/Empty";
import { useMoveBack } from "../../hooks/useMoveBack";
import { useGetBooking } from "./useGetBooking";
import Spinner from "../../ui/Spinner";
import { useNavigate } from "react-router-dom";
import { useCheckout } from "../check-in-out/useCheckout";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import { useDeleteBooking } from "./useDeleteBooking";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

export default function BookingDetail() {
  const { isLoading, booking = {} } = useGetBooking();
  const { checkout, isCheckingOut } = useCheckout();
  const { deleteBooking, isDeletingBooking } = useDeleteBooking();
  const navigate = useNavigate();
  const moveBack = useMoveBack();

  const statusToTagName = {
    unconfirmed: "blue",
    "checked-in": "green",
    "checked-out": "silver",
  };

  if (isLoading) return <Spinner />;
  if (!booking) return <Empty resource="booking">booking</Empty>;
  return (
    <Modal>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{booking.id}</Heading>
          <Tag type={statusToTagName[booking.status]}>
            {booking.status?.replace("-", " ")}
          </Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
        {booking["status"] === "unconfirmed" && (
          <Button onClick={() => navigate(`/checkin/${booking.id}`)}>
            Check in
          </Button>
        )}

        {booking["status"] === "checked-in" && (
          <Button onClick={() => checkout()} disabled={isCheckingOut}>
            Check out
          </Button>
        )}

        <Modal.Window
          name="delete-booking"
          renderForm={(close) => (
            <ConfirmDelete
              resourceName={booking}
              onClose={close}
              onConfirm={() =>
                deleteBooking(
                  { bookingId: booking.id },
                  /*
                  ////////[Second param of deleteBooking(this is a rename of mutate in useDeleteBooking)]
                  We can do all sorts of operation here like onSettled, onError, and onSuccess
                  this simplifies and isolated every reaction of multiple different mutate
                  this also makes we MIGHT NOT have to do the operations in the specific .js
                  */
                  {
                    onSettled: () => navigate(-1),
                  }
                )
              }
              disabled={isDeletingBooking}
            />
          )}
        />

        <Modal.Open
          opens="delete-booking"
          renderButton={(opens) => {
            return (
              <Button variations="danger" onClick={opens}>
                Delete
              </Button>
            );
          }}
        />

        <Button variations="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </Modal>
  );
}
