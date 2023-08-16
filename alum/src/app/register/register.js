"use client";

import Compressor from "compressorjs";
import Link from "next/link";
import { useState } from "react";
import Cookies from "universal-cookie";

export default function Register({ type, otp, email }) {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const pattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{8,}$/;
    setLoading(true);
    setError("");
    if (pattern.test(password)) {
      if (password != confirmPassword) {
        setLoading(false);
        setError("Password dont match");
      } else {
        try {
          await fetch("/api/register", {
            method: "POST",
            body: JSON.stringify({
              email: email,
              otp: otp.toString(),
              password: password,
              files: image,
              type: type,
              verified: type == "student",
            }),
          })
            .then((e) => e.json())
            .then((e) => {
              if (e.error) {
                setLoading(false);
                setError(e.message);
              } else {
                var expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 100);
                let cookies = new Cookies();
                cookies.set("session_id", e.key, {
                  secure: true,
                  sameSite: "lax",
                  path: "/",
                  expires: expirationDate,
                });
                location.replace("/");
                setLoading("");
              }
            });
        } catch {
          setLoading(false);
          setError("Some error occured");
        }
      }
    } else {
      setLoading(false);
      setError("Please enter the password in the provided format");
    }
  };
  const base64Converter = (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    try {
      reader.onload = function () {
        setError("");
        setImage(reader.result);
      };
      reader.onerror = function (error) {
        setError("Some error occured uploading the image.");
      };
    } catch {
      setError("Some error occured uploading the image.");
    }
  };
  const imageHandler = (e) => {
    const image = e.target.files[0];
    try {
      new Compressor(image, {
        quality: 0.8,
        success: (compressedResult) => {
          base64Converter(compressedResult);
        },
      });
    } catch {
      setError("Some error occured uploading the image.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="m-2 relative mb-6 w-[70%] mx-auto">
        {/* <input value={email} type="email" disabled></input> */}
        <input
          className="bg-[#DFE6F9] pl-10 text-lg text-gray-900  rounded-xl w-full p-2.5 "
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{8,}$"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          style={{ marginBottom: 10 }}
        ></input>
        {/* Your password must be at least 8 characters long, include one uppercase
      letter, one lowercase letter, one number, one special character (choose
      from - #,@, $, !, %, *, ?, &), and not contain spaces. */}
        <input
          className="bg-[#DFE6F9] pl-10 text-lg text-gray-900  rounded-xl w-full p-2.5 "
          pattern="^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&]{8,}$"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        ></input>

        {type == "alumni" && (
          <>
            <div className="file" style={{ marginBottom: 10 }}>
              <br></br>
              Please attach a scanned image of your degree
            </div>
            <input
              className="bg-[#DFE6F9] pl-10 text-lg text-gray-900  rounded-xl w-full p-2.5 "
              type="file"
              accept="image/*"
              onChange={imageHandler}
              required
              style={{ marginBottom: 10 }}
            ></input>

            {image && (
              <img
                src={image}
                style={{ width: "100%" }}
                alt="Verification document uploaded by user"
              ></img>
            )}
          </>
        )}
      </div>
      <div className="text-red-600">{error && error}</div>

      <button
        className=" mb-10 m-4 w-[70%] text-white bg-[#00183F] hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 text-lg rounded-xl text-md px-5 py-2.5 mr-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        type="submit"
        disabled={loading}
        style={{ backgroundColor: "black", marginBottom: 10 }}
      >
        {loading ? "Registering...." : "Register"}
      </button>
      <Link href="/login">
        <div className="text-black-600" style={{ marginTop: 10 }}>
          Already registered ? Login Now
        </div>
      </Link>
    </form>
  );
}
