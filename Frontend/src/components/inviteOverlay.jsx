import React, { useState } from "react";
import styled from "styled-components";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
  animation: fadeIn 0.2s ease;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;
const Modal = styled.div`
  background: white;
  border-radius: 1rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
    0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;
const ModalHeader = styled.div`
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;

  h2 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #1f2937;
    letter-spacing: -0.3px;
  }
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 14px;
  color: #1f2937;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: #8e7eff;
    box-shadow: 0 0 0 3px rgba(142, 126, 255, 0.1);
  }
`;
const CloseButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: #6b7280;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  transition: all 0.2s ease;

  &:hover {
    background: #f3f4f6;
    color: #1f2937;
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;
const ModalFooter = styled.div`
  padding: 1.5rem 2rem;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const CancelButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  color: #374151;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f9fafb;
    border-color: #9ca3af;
  }
`;

const CreateButton = styled.button`
  padding: 0.625rem 1.25rem;
  background: linear-gradient(135deg, #8e7eff 0%, #7c6aed 100%);
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(142, 126, 255, 0.25);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(142, 126, 255, 0.35);
  }

  &:active {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;
function inviteOverlay({ roomID, onDismiss, onError }) {
  const [email, setEmail] = useState("");
  const handleRoomInvite = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/room/${roomID}/add`, {
        method: "PUT",
        credentials: "include",
        headers: {
        "Content-Type": "application/json",  
      },
        body: JSON.stringify({ email: email }),
      });
      if (!response.ok) {
        console.log("Error", response.status);
        return;
      }
      console.log("Success!");
    } catch (err) {
      console.log("Error inviting user", err);
      onError("Failed to invite user");
    }
  };
  return (
    <Overlay>
      <Modal>
        <ModalHeader>
          <h2>Add Friends To Your Room</h2>
          <CloseButton onClick={onDismiss}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </CloseButton>
        </ModalHeader>
        <form onSubmit={handleRoomInvite}>
          {/* <Label htmlFor="email">Invite Friends!</Label> */}
          <Input
            id="email"
            type="text"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
          />
          <ModalFooter>
            <CancelButton type="button" onClick={onDismiss}>
              Cancel
            </CancelButton>
            <CreateButton type="submit" disabled={!email}>
              Invite
            </CreateButton>
          </ModalFooter>
        </form>
      </Modal>
    </Overlay>
  );
}
export default inviteOverlay;
