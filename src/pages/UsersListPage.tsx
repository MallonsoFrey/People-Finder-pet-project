import { useEffect, useState } from "react";
import { Pagination } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchUsers } from "../store/usersSlice";
import UserModal from "../components/UserModal";

const UsersListPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [inputValue, setInPutValue] = useState<string>("");

  const { users, loading, error } = useAppSelector((state) => state.users);

  const [page, setPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(users.length / usersPerPage);

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number,
  ) => {
    setPage(value);
  };

  // Обработка состояний загрузки и ошибок
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const filteredUsers = currentUsers.filter((user) =>
    user.name
      .toLocaleLowerCase()
      .includes(inputValue.trim().toLocaleLowerCase()),
  );

  return (
    <div className="main-page-container">
      <div className="users-container">
        <div className="users-searchbar-container">
          <input
          name="user search"
            placeholder="Who do you want to find?"
            className="users-searchbar"
            type="text"
            value={inputValue}
            onChange={(e) => setInPutValue(e.target.value)}
          />
          <img className="searchbar-svg" src="/search.svg" alt="search icon" />
          <img
            className="searchbar-delete"
            src="/cross.svg"
            alt="delete search icon"
            onClick={() => setInPutValue("")}
          />
        </div>
        {filteredUsers.length !== 0 ? (
          filteredUsers.map((user) => (
            <p className="user-preview" key={user.id} onClick={() => navigate(`/users/${user.id}`)}>
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ maxWidth: "30px" }}
                />
              )}
              {user.name}
              <img className="open-user-svg" src="/right.svg" alt="right arrow icon" />
            </p>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
      <UserModal/>

      <Pagination
      className="pagination"
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        variant="outlined"
        color="secondary"
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
      />
    </div>
  );
};

export default UsersListPage;
