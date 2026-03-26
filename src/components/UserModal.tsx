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
        <input placeholder="Name" {...register("name", { required: true })} />
        {errors.name && <span>Name is required</span>}

        <input placeholder="Email" {...register("email", { required: true })} />
        {errors.email && <span>Email is required</span>}

        <Controller
          name="phone"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <PhoneInput
              country={"us"}
              value={field.value}
              onChange={field.onChange}
              inputStyle={{ width: "100%" }}
            />
          )}
        />

        <button className="add-user-btn" type="submit">
          <img src="/cross.svg" alt="add user icon" />
          Add user
        </button>
      </form>
    </div>
  );
};

export default UserModal;
