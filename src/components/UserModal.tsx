import { useForm, SubmitHandler } from "react-hook-form";
import { addUser } from "../store/usersSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../store/hooks";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { Controller } from "react-hook-form";

type Inputs = {
  name: string;
  email: string;
  phone: string;
};

const UserModal = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<Inputs>();

  const generateAvatar = (name: string) => {
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`;
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const newUser = {
      ...data,
      avatar: generateAvatar(data.name),
    };

    if (newUser) {
      try {
        await dispatch(addUser(newUser)).unwrap();
        navigate("/");
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  };

  return (
    <div className="add-user-modal">
      <div className="modal-title">
        <img src="/cross.svg" alt="add user icon" />
        Adding a new user
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

        <button className="add-user-btn" type="submit">
          <img src="/cross.svg" alt="add user icon" />
          Add user
        </button>
      </form>
    </div>
  );
};

export default UserModal;
