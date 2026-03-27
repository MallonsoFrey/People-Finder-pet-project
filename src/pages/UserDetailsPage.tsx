import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Typography, CircularProgress } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUserById, removeUser } from "../store/usersSlice";
import { Modal } from "@mui/material";
import UserModal from "../components/UserModal";

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    currentUser: user,
    loading,
    error,
  } = useAppSelector((state) => state.users);

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (id) {
      try {
        await dispatch(removeUser(id)).unwrap();
        navigate("/");
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error: {error}</Typography>;
  if (!user) return <Typography>User not found</Typography>;

  return (
    <div>
      <div className="user-details-container">
        <div className="btns-container">
          <button className="back-to-list-btn" onClick={() => navigate("/")}>
            Back
            <img
              className="back-to-list-svg"
              src="/left.svg"
              alt="left arrow"
            />
          </button>
          <div className="user-details-left-btns">
            <button
              className="edit-user-btn"
              onClick={() => setIsModalOpen(true)}
            >
              <img src="/edit.svg" alt="delete profile icon" />
            </button>

            <button className="back-delete-btn" onClick={handleDelete}>
              <img src="/delete.svg" alt="delete profile icon" />
            </button>
          </div>
        </div>
        <p className="user-name">{user.name}</p>

        <div className="details-container">
          <p className="user-detail">
            <img src="/mail.svg" alt="mail icon" />
            {user.email}
          </p>
          <p className="user-detail">
            <img src="/mobile.svg" alt="mobile icon" />+{user.phone}
          </p>
          <p className="user-detail">
            <img src="/calendar.svg" alt="calendar icon" />
            {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {user.avatar && (
          <img
            src={user.avatar}
            alt={user.name}
            style={{ marginTop: "20px", maxWidth: "200px" }}
          />
        )}
      </div>

      <Modal open={isModalOpen} onClose={closeModal}>
        <UserModal mode="edit" setModalOpen={setIsModalOpen} user={user}/>
      </Modal>
    </div>
  );
};

export default UserDetailPage;
