import { useForm, SubmitHandler } from "react-hook-form";
import { addUser, editUser } from "../store/usersSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Controller } from "react-hook-form";
import { User } from "../api/usersApi";
import { useState } from "react";

type Inputs = {
  name: string;
  email: string;
  phone: string;
};

type ModalProps = {
  mode: "add" | "edit";
  setModalOpen?: (arg: boolean) => void;
  user?: User;
};

const UserModal = (props: ModalProps) => {
  const user = props.user;
  const mode = props.mode;
  const setModalOpen = props.setModalOpen;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isSaving, setIsSaving] = useState(false);

  const closeModal = () => {
    if (setModalOpen) setModalOpen(false);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Inputs>({
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
    },
  });

  const generateAvatar = (name: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (mode === "add") {
      const newUser = {
        ...data,
        avatar: generateAvatar(data.name),
      };

      if (newUser) {
        try {
          setIsSaving(true);
          await dispatch(addUser(newUser)).unwrap();
          navigate("/");
        } catch (error) {
          console.error("Error creating user:", error);
        }
      }
    } else if (user?.id) {
      const editedUser = {
        id: user.id,
        user: data,
      };

      if (editedUser) {
        try {
          setIsSaving(true);
          await dispatch(editUser(editedUser)).unwrap();
          closeModal();
          navigate(`/users/${user.id}`);
        } catch (error) {
          console.error("Error editing user:", error);
        }
      }
    }
  };

  return (
    <div className={`add-user-modal ${mode === "edit" && "edit-user-modal"}`}>
      <div className="modal-title">
        {mode === "add" ? (
          <>
            <img
              className="add-user-img"
              src="/cross.svg"
              alt="add user icon"
            />
            Adding a new user
          </>
        ) : (
          <>
            <img className="edit-icon" src="/edit.svg" alt="edit user icon" />
            Edit user
            <button className="close-modal" onClick={closeModal}>
              <img src="/cross.svg" alt="close modal icon" />
            </button>
          </>
        )}
      </div>
      <form className="modal-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="input-container">
          <input
            placeholder="Name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Minimum 2 characters",
              },
            })}
          />
          {errors?.name && (
            <span className="error-message">{errors.name.message}</span>
          )}
        </div>

        <div className="input-container">
          <input
            placeholder="Email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email",
              },
            })}
          />
          {errors?.email && (
            <span className="error-message">{errors.email.message}</span>
          )}
        </div>

        <div className="input-container">
          <Controller
            name="phone"
            control={control}
            rules={{
              required: "Phone is required",
              validate: (value) => value.length > 6 || "Phone is too short",
            }}
            render={({ field }) => (
              <PhoneInput
                country={"us"}
                value={field.value}
                onChange={field.onChange}
                inputStyle={{ width: "100%" }}
              />
            )}
          />
          {errors?.phone && (
            <span className="error-message">{errors.phone.message}</span>
          )}
        </div>

        {mode === "add" ? (
          <button className="add-user-btn" type="submit">
            {isSaving ? (
              <>
                <span className="loader"></span> Saving
              </>
            ) : (
              <>
                <img
                  className="add-user-img"
                  src="/cross.svg"
                  alt="add user icon"
                />
                Add user
              </>
            )}
          </button>
        ) : (
          <button className="add-user-btn" type="submit">
            {isSaving ? (
              <>
                <span className="loader"></span>Saving
              </>
            ) : (
              <>
                <img className="edit-icon" src="/ok.svg" alt="save user icon" />{" "}
                Save
              </>
            )}
          </button>
        )}
      </form>
    </div>
  );
};

export default UserModal;
