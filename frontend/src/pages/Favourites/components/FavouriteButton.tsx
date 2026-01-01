import React from "react";
import "../../../shared/styles/FavouriteButton.css";

type Props = {
  liked: boolean;
  disabled?: boolean;
  onToggle: () => void;
  
};

const FavouriteButton: React.FC<Props> = ({ liked, disabled, onToggle }) => {
  return (
    <button
      type="button"
      className={`fav-btn fav-bottom-right ${liked ? "is-liked" : ""}`}
      aria-pressed={liked}
      aria-label={liked ? "Remove from favorites" : "Add to favorites"}
      title={liked ? "Remove from favorites" : "Add to favorites"}
      onClick={onToggle}
      disabled={disabled}
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 20"
        fill={liked ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 21s-6.7-4.35-10-9.33C-1.1 6.74 2.13 2 6.5 2 8.87 2 10.5 3.5 12 5.09 13.5 3.5 15.13 2 17.5 2 21.87 2 25.1 6.74 22 11.67 18.7 16.65 12 21 12 21z" />
      </svg>
    </button>
  );
};

export default FavouriteButton;
