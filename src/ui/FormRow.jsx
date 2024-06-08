import styled, { css } from "styled-components";
import PropTypes from "prop-types";
import { useUser } from "../features/authentication/useUser";
import defaultImg from "../../public/default-user.jpg";

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;
  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const AvatarLabel = styled.label`
  font-weight: 500;
  ${(type) => type && css(`text-align:"center"`)}
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

const Avatar = styled.div`
  display: flex;
  flex-direction: column;
`;

const AvatarImg = styled.img`
  aspect-ratio: 1/1;
  border-radius: 8px;
  object-fit: cover;
`;

export default function FormRow({ label, error, children, avatar }) {
  const {
    user: {
      user_metadata: { avatar: avatarImg },
    },
  } = useUser();
  console.log(avatarImg);
  return (
    <StyledFormRow>
      <Avatar>
        {avatar && <AvatarImg src={avatarImg || defaultImg} />}
        {label && (
          <AvatarLabel
            htmlFor={children.props.id}
            type={avatar ? "avatar" : ""}
          >
            {label}
          </AvatarLabel>
        )}
      </Avatar>
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

FormRow.propTypes = {
  label: PropTypes.any,
  error: PropTypes.any,
  children: PropTypes.any,
  avatar: PropTypes.boolean,
};
