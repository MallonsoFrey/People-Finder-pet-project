import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUserById, removeUser } from "../store/usersSlice";

const UserDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { currentUser: user, loading, error } = useAppSelector((state) => state.users);

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

  if (loading) return <CircularProgress />;
  if (error) return <Typography>Error: {error}</Typography>;
  if (!user) return <Typography>User not found</Typography>;

  return (
    <div style={{ padding: "20px" }}>
      <button className="back-to-list-btn" onClick={() => navigate("/")}>
        Back
        <img className="back-to-list-svg" src="/left.svg" alt="" />
      </button>

      <Button
        variant="contained"
        color="error"
        onClick={handleDelete}
        sx={{ mb: 2, ml: 2 }}
      >
        Удалить
      </Button>

      <Card>
        <CardContent>
          <Typography variant="h4">{user.name}</Typography>
          <Typography color="text.secondary">Email: {user.email}</Typography>
          <Typography color="text.secondary">Phone: {user.phone}</Typography>
          <Typography color="text.secondary">
            Created: {new Date(user.createdAt).toLocaleDateString()}
          </Typography>
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.name}
              style={{ marginTop: "20px", maxWidth: "200px" }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserDetailPage;