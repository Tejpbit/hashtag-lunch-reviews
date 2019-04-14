import React, {
  MouseEvent,
  TouchEvent,
  useRef,
  useEffect,
  HTMLAttributes,
  DetailedHTMLProps
} from "react";
import styled from "styled-components";
import _ from "lodash";
import star from "../images/star-solid.svg";
import hollowStar from "../images/star-regular.svg";
import { formatStarRating } from "./utils/formatter";

interface Props {
  rating: number;
  onChange: (rating: number) => void;
}
const starSize = window.innerWidth > 600 ? 16 : 32;

const clamp = (num: number, max: number, min: number) =>
  Math.max(min, Math.min(max, num));

export const StarRating = ({ rating, onChange }: Props) => {
  const mouseDown = useRef(false);

  const starClickHandler = (
    event: MouseEvent<HTMLDivElement> | TouchEvent<HTMLDivElement>
  ) => {
    const posX = "clientX" in event ? event.clientX : event.touches[0].clientX;
    const container = event.currentTarget as HTMLDivElement;
    const newRating =
      clamp((posX - container.offsetLeft) / container.offsetWidth, 1, 0) * 5;

    if (onChange) {
      onChange(newRating);
    }
  };

  useEffect(() => {
    const handler = () => (mouseDown.current = false);
    window.addEventListener("mouseup", handler);
    window.addEventListener("touchend", handler);
    return () => {
      window.removeEventListener("mouseup", handler);
      window.removeEventListener("touchend", handler);
    };
  }, []);

  return (
    <StarRatingView
      onClick={starClickHandler}
      onMouseDown={() => (mouseDown.current = true)}
      onMouseMove={e => mouseDown.current && starClickHandler(e)}
      onTouchStart={() => (mouseDown.current = true)}
      onTouchMove={e => mouseDown.current && starClickHandler(e)}
      rating={rating}
      showValue
    />
  );
};

type DivProps = DetailedHTMLProps<
  HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

interface StarRatingViewProps {
  rating: number;
  showValue?: boolean;
}

export const StarRatingView = ({
  rating,
  showValue = false,
  ...props
}: StarRatingViewProps & DivProps) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}
    >
      <div
        style={{ width: 5 * starSize, height: starSize, touchAction: "none" }}
        {...props}
      >
        <StarDiv style={{ width: rating * starSize }} />
        <HollowStarDiv style={{ width: 5 * starSize }} />
      </div>
      {showValue && formatStarRating(rating)}
    </div>
  );
};

const Star = styled.div`
  background-repeat: repeat-x;
  background-size: ${starSize}px;
  height: ${starSize}px;
  position: absolute;
  color: #f8c51c;
`;

const StarDiv = styled(Star)`
  background-image: url(${star});
  z-index: 1;
`;

const HollowStarDiv = styled(Star)`
  background-image: url(${hollowStar});
  z-index: 0;
`;
