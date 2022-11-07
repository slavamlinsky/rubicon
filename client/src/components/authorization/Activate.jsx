import React from "react";
import "./authorization.css";

import { useSelector } from "react-redux";

const Activate = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const userEmail = currentUser.email;

  return (
    <div className="confirmation">
      <div style={{ textAlign: "center" }}>
        {/* тут можно какую-то красивую ещё картинку */}
        <img
          src="https://cdn2.iconfinder.com/data/icons/komiko/128/cartoon-01-4-512.png"
          width="150px"
          alt="Email confirmation"
        />
      </div>
      <div className="confirmation__header">Подтвердите Ваш Email</div>
      <div className="confirmation__message">
        <p>
          Вы успешно зарегистрировались в системе. Для начала работы{" "}
          <b>осталось активировать вашу учётную запись</b>.
        </p>
        <p>
          На почту {userEmail} отправлено письмо. Откройте его и перейдите по
          ссылке для активации.
        </p>
        <p>Если не можете найти письмо, проверьте папку "спам".</p>
        <p>
          Если у Вас возникли другие проблемы с регистрацией, свяжитесь с
          администратором и мы Вам поможем.
        </p>
      </div>
    </div>
  );
};

export default Activate;
