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
  const [sortOrder, setSortOrder] = useState<"asc" | null>(null);

  const { users, loading, error } = useAppSelector((state) => state.users);

  const [page, setPage] = useState(1);
  const usersPerPage = 10;

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const indexOfLastUser = page * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

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

  const filteredUsers = users
    .filter((user) =>
      user.name
        .toLocaleLowerCase()
        .includes(inputValue.trim().toLocaleLowerCase()),
    )
    .reverse();

  const processedUsers = filteredUsers
    .filter((user) =>
      user.name.toLowerCase().includes(inputValue.trim().toLowerCase()),
    )
    .sort((a, b) => {
      if (!sortOrder) return 0;

      const result = a.name.localeCompare(b.name, ["en", "ru"], {
        sensitivity: "base",
      });

      return sortOrder === "asc" ? result : -result;
    })
    .slice(indexOfFirstUser, indexOfLastUser);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

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
          <img
            className="sort-svg"
            src="/sort.svg"
            alt="sort users icon"
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? null : "asc"))
            }
          />
        </div>
        {processedUsers.length !== 0 ? (
          processedUsers.map((user) => (
            <p
              className="user-preview"
              key={user.id}
              onClick={() => navigate(`/users/${user.id}`)}
            >
              {user.avatar && (
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ maxWidth: "30px" }}
                />
              )}
              {user.name}
              <div className="list-img">
                <img
                  className="open-user-svg"
                  src="/right.svg"
                  alt="right arrow icon"
                />
              </div>
            </p>
          ))
        ) : (
          <p>No users found</p>
        )}
      </div>
      <UserModal />

      <Pagination
        className="pagination"
        count={totalPages}
        page={page}
        onChange={handlePageChange}
        variant="outlined"
        color="secondary"
        sx={{ mt: 3, display: "flex", justifyContent: "center" }}
      />

      <button
        id="scrollToTopBtn"
        title="Go to top"
        onClick={() => scrollToTop()}
      >
        <img src="/right.svg" alt="go up button" />
      </button>
    </div>
  );
};

export default UsersListPage;
