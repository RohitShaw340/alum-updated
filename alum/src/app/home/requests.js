"use client";

import { useEffect, useState } from "react";
import Error from "../error";
import Loading from "./loading";

export default function Requests({ status }) {
  const [show, setShow] = useState(false);
  const [img, setImg] = useState("");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState("");
  const [error, setError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const process = async (type, position, second_email) => {
    let temproryData = data;
    temproryData.splice(position, 1);
    await fetch(`/api/requests-action`, {
      method: "POST",
      body: JSON.stringify({
        email: status.data.email,
        second_email: second_email,
        verified: type == "approve" ? "true" : "false",
        error:
          type == "approve"
            ? ""
            : "Your profile was rejected. Please upload new files for verification.",
      }),
      cache: "no-cache",
    }).then((e) => e.json());
    setData(temproryData);
    setRefresh(!refresh);
  };
  const fetchRequests = async () => {
    const res = await fetch(`/api/requests`, {
      method: "POST",
      body: JSON.stringify({
        email: status.data.email,
      }),
      cache: "no-cache",
    }).then((e) => e.json());
    if (res.error) {
      setError(true);
      setLoading(false);
    } else {
      setError(false);
      setData(res.data);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchRequests();
  }, [refresh]);
  return (
    <div className="admin">
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <Error></Error>
      ) : (
        <div className="table-overflow">
          <table>
            {show && (
              <div className="modal">
                <div
                  className="modal-content"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <img src={img} height="auto" width="100%"></img>
                  <button
                    onClick={() => {
                      document
                        .querySelector("body")
                        .classList.remove("no-scroll");
                      setShow(false);
                    }}
                    id="edit-close"
                    className="form-close"
                  >
                    X
                  </button>
                </div>
              </div>
            )}
            {data.map((e) => {
              return (
                <tr>
                  <th>
                    <center>
                      <img
                        height={50}
                        style={{
                          maxHeight: 50,
                          height: 50,
                          maxWidth: 70,
                          margin: 10,
                        }}
                        src={e.files}
                        onClick={(temp) => {
                          setImg(e.files);
                          document
                            .querySelector("body")
                            .classList.add("no-scroll");
                          setShow(true);
                        }}
                        alt="Verification document uploaded by User"
                      ></img>
                    </center>
                  </th>
                  <th>
                    <center>
                      <p style={{ fontWeight: "lighter" }}>{e.email}</p>
                    </center>
                  </th>
                  <th>
                    <center>
                      <button
                        style={{
                          backgroundColor: "lightgreen",
                          padding: 2,
                          paddingLeft: 10,
                          paddingRight: 10,
                          borderRadius: 20,
                          margin: 10,
                          fontWeight: "lighter",
                          fontSize: 14,
                        }}
                        onClick={() => {
                          process("approve", data.indexOf(e), e.email);
                        }}
                      >
                        Approve
                      </button>
                      <button
                        style={{
                          backgroundColor: "red",
                          padding: 2,
                          paddingLeft: 10,
                          paddingRight: 10,
                          borderRadius: 20,
                          margin: 10,
                          fontWeight: "lighter",
                          fontSize: 14,
                        }}
                        onClick={() => {
                          process("reject", data.indexOf(e), e.email);
                        }}
                      >
                        Reject
                      </button>
                    </center>
                  </th>
                </tr>
              );
            })}
          </table>
        </div>
      )}
    </div>
  );
}
