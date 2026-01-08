"use client";
import { useState,useEffect } from "react";
import "../style/login.css";
import Swal from "sweetalert2";
import { auth, googleProvider, db } from "../../../firebaseConfig";
import { signInWithPopup, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { API_URL } from "../config/config";
import Link from "next/link";
import Image from "next/image";
export default function DangNhap() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch(`${API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        Swal.fire("Thành công", "Đăng nhập thành công!", "success");
        setTimeout(() => {
          window.location.href = "/account";
        }, 1500);
      } else {
        Swal.fire("Lỗi", data.message || "Đăng nhập thất bại!", "error");
      }
    } catch (error) {
      console.error("Lỗi:", error);
      Swal.fire("Lỗi", "Lỗi máy chủ!", "error");
    }
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: resetEmail }),
      });
      const data = await res.json();
      if (res.ok) {
        setOtpToken(data.otpToken);
        setStep("otp");
        Swal.fire("Thành công", "OTP đã được gửi!", "success");
      } else {
        Swal.fire("Lỗi", data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Lỗi gửi OTP!", "error");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/api/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp, newPassword, otpToken }),
      });
      const data = await res.json();
      if (res.ok) {
        Swal.fire("Thành công", "Đặt lại mật khẩu thành công!", "success");
        setStep("email");
      } else {
        Swal.fire("Lỗi", data.message, "error");
      }
    } catch (err) {
      console.error(err);
      Swal.fire("Lỗi", "Lỗi đặt lại mật khẩu!", "error");
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Kiểm tra nếu user đã tồn tại trong Firestore
      const userRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        // Lưu thông tin user mới vào Firestore
        await setDoc(userRef, {
          uid: user.uid,
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          createdAt: new Date(),
        });
      }

      alert("Đăng nhập Google thành công!");
    } catch (error) {
      console.error("Lỗi đăng nhập Google:", error);
    }
  };

 useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User hiện tại:", user);
    } else {
      console.log("Chưa đăng nhập");
    }
  });

  return () => unsubscribe();
}, []);

  return (
    <div>
     
      <section className="bread-crumb">
        <div className="container1">
          <div className="rows">
            <div className="col-xs-12">
              <div className="breadcrumb-title">
                <b> Đăng nhập</b>
              </div>

              <ul className="breadcrumb">
                <li className="home">
                  <Link href="/">
                    <span>Trang chủ</span>
                  </Link>
                  <span> / </span>
                </li>

                <li>
                  <strong>
                    <span> Đăng nhập</span>
                  </strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      <div className="container1 mx-auto max-w-6xl">
        <h1 className="title-head">
          <span>Đăng nhập tài khoản</span>
        </h1>

        <div className="rows">
          <div className="col-lg-6 text-[14px]">
            <div className="page-login margin-bottom-30">
              <div id="login" className="px-4">
                <div className="social-login  text-left margin-bottom-20 ">
                  <Link
                    href="#"
                    className="social-login--facebook mr-[5px]"
                    style={{ display: "inline-block" }}
                  >
                    <Image
                      width={129}
                      height={37}
                      alt="facebook-login-button"
                      src="https://bizweb.dktcdn.net/assets/admin/images/login/fb-btn.svg"
                    />
                  </Link>
                  <button onClick={handleGoogleSignIn}>
                    <Link
                      href="#"
                      className="social-login--google mr-[5px]"
                      style={{ display: "inline-block" }}
                    >
                      <Image
                        width={129}
                        height={37}
                        alt="google-login-button"
                        src="https://bizweb.dktcdn.net/assets/admin/images/login/gp-btn.svg"
                      />
                    </Link>
                  </button>
                </div>
                <span>Nếu bạn đã có tài khoản, đăng nhập tại đây.</span>
                <form id="customer_login" onSubmit={handleLogin}>
                  <input name="FormType" type="hidden" value="customer_login" />
                  <input name="utf8" type="hidden" value="true" />

                  <div className="form-signup clearfix">
                    <fieldset className="form-group">
                      <label>Email: </label>
                      <input
                        type="email"
                        className="form-control form-control-lg"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        name="email"
                        id="customer_email"
                        placeholder="Email"
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <label>Mật khẩu:</label>

                      <div className="password-wrapper">
                        <input
                          type={showPassword ? "text" : "password"}
                          className="form-control form-control-lg"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          name="password"
                          id="customer_password"
                          placeholder="Mật khẩu"
                        />

                        <i
                          className={`fa-solid ${
                            showPassword ? "fa-eye-slash" : "fa-eye"
                          }`}
                          onClick={() => setShowPassword(!showPassword)}
                        ></i>
                      </div>
                    </fieldset>

                    <div className="pull-xs-left" style={{ marginTop: "25px" }}>
                      <button className="btn btn-primary" type="submit">
                        Đăng nhập
                      </button>
                      {/* <input className="btn btn-primary" type="submit" value="Đăng nhập" /> */}
                      <Link
                        href="/account/register"
                        className="btn-link-style btn-register"
                        style={{
                          marginLeft: " 20px",
                          textDecoration: " underline ",
                        }}
                      >
                        Đăng ký
                      </Link>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="col-lg-6 text-[14px]">
            <div id="recover-password" className="form-signup margin-bottom-20">
              <span>
                Bạn quên mật khẩu? Nhập địa chỉ email để lấy lại mật khẩu qua
                email.
              </span>
              <form
                onSubmit={
                  step === "email" ? handleSendOtp : handleResetPassword
                }
              >
                {step === "email" && (
                  <fieldset className="form-group">
                    <label>Email: </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="Email"
                      required
                    />
                  </fieldset>
                )}

                {step === "otp" && (
                  <>
                    <fieldset className="form-group">
                      <label>Mã OTP: </label>
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Nhập OTP"
                        required
                      />
                    </fieldset>
                    <fieldset className="form-group">
                      <label>Mật khẩu mới: </label>
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mật khẩu mới"
                        required
                      />
                    </fieldset>
                  </>
                )}
                <div className="action_bottom">
                  <input
                    className="btn btn-primary"
                    style={{ marginTop: "25px" }}
                    type="submit"
                    value={
                      step === "email" ? "Lấy lại mật khẩu" : "Đặt lại mật khẩu"
                    }
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
