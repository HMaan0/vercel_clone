"use client";
import Link from "next/link";
import Available from "./Available";
import { Button } from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import NotAvailable from "./NotAvailable";
import { useState } from "react";
import { checkDomain } from "../lib/checkValidDomain";
import { domainAvailable } from "../lib/actions/domainAvailable";

const EditDomain = ({
  projectId,
  ip,
  deploymentIp,
}: {
  projectId: string;
  ip: string | null;
  deploymentIp: (projectId: string) => string | undefined;
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [domainLoading, setDomainLoading] = useState(false);
  const [newDomain, setNewDomain] = useState<string | null>(null);
  const [validDomain, setValidDomain] = useState(false);
  const [validDomainLoading, setValidDomainLoading] = useState(false);

  async function handleEditDomain() {
    if (typeof newDomain === "string") {
      setDomainLoading(true);
      setValidDomainLoading(true);
      const domainIsValid = checkDomain(newDomain);
      if (domainIsValid) {
        const userIp = ip || deploymentIp(projectId);
        if (userIp) {
          const domainIsAvailable = await domainAvailable(newDomain);
          setValidDomain(domainIsAvailable);
        }
      } else {
        setValidDomain(domainIsValid);
      }
      setValidDomainLoading(false);
      setTimeout(() => {
        setDomainLoading(false);
      }, 7000);
    }
  }
  return (
    <>
      <div className="w-full flex justify-between  items-start">
        <h1 className="text-2xl font-bold mb-6  ">
          {ip ? (
            <Link
              className="text-blue-400 hover:text-blue-400/80 "
              href={`http://${ip}`}
            >
              http://{ip}
            </Link>
          ) : (
            `${
              deploymentIp(projectId) ? (
                <Link
                  className="text-blue-400 hover:text-blue-400/80"
                  href={`http://${deploymentIp(projectId)}`}
                >
                  http://{deploymentIp(projectId)}
                </Link>
              ) : (
                "New Project"
              )
            }`
          )}
        </h1>
        {deploymentIp(projectId) ||
          (ip && (
            <Button onClick={() => setShowEdit((prev) => !prev)}>
              {showEdit ? "Hide" : "Edit"}
            </Button>
          ))}
      </div>
      {showEdit && (
        <div className="bg-zinc-900 rounded p-4 mb-6 flex flex-col gap-2">
          <p>Edit Domain</p>
          <div className="w-full flex gap-3">
            <input
              className="w-full bg-zinc-900 rounded px-3 py-2 border border-zinc-800 text-white "
              placeholder={`http://${ip || deploymentIp(projectId)}`}
              onChange={(e) => setNewDomain(e.target.value)}
            ></input>
            <Button
              onClick={handleEditDomain}
              disabled={!newDomain}
              loading={domainLoading}
            >
              Apply
            </Button>
          </div>
          <div className="flex gap-2 items-center mt-5">
            {domainLoading && (
              <>
                {validDomainLoading ? (
                  <LoadingSpinner />
                ) : validDomain ? (
                  <Available />
                ) : (
                  <NotAvailable />
                )}

                <p>
                  Checking if{" "}
                  <span className="font-medium text-blue-400">{newDomain}</span>{" "}
                  is available
                </p>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EditDomain;
