"use client";
import Link from "next/link";
import Available from "./Available";
import { Button } from "./Button";
import LoadingSpinner from "./LoadingSpinner";
import NotAvailable from "./NotAvailable";
import { useState } from "react";
import { checkDomain } from "../lib/checkValidDomain";
import axios from "axios";
import { useIpStore } from "../store/ipStore";

const EditDomain = ({
  projectId,
  ip,
  domain,
}: {
  projectId: string;
  ip: string | null;
  domain: string | null;
}) => {
  const [showEdit, setShowEdit] = useState(false);
  const [domainLoading, setDomainLoading] = useState(false);
  const [newSubDomain, setNewSubDomain] = useState<string | null>(null);
  const [validDomain, setValidDomain] = useState(false);
  const [validDomainLoading, setValidDomainLoading] = useState(false);
  const deploymentIp = useIpStore((state) => state.getDeploymentIp);
  const setDeploymentIp = useIpStore((state) => state.setDeploymentIp);

  async function handleEditDomain() {
    try {
      if (
        typeof ip === "string" ||
        typeof deploymentIp(projectId) === "string"
      ) {
        if (typeof newSubDomain === "string") {
          setDomainLoading(true);
          setValidDomainLoading(true);
          const domainIsValid = checkDomain(newSubDomain);
          if (domainIsValid) {
            const instanceIp = ip || deploymentIp(projectId);
            if (instanceIp) {
              const newDomain = newSubDomain + ".vercelws.xyz";
              const res = await axios.put(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}update`,
                {
                  newDomain,
                  instanceIp,
                }
              );
              if (typeof res.data === "boolean") {
                const domainIsAvailable = res.data;
                setValidDomain(domainIsAvailable);
                if (domainIsAvailable) {
                  setDeploymentIp(projectId, newDomain);
                }
              }
            }
          } else {
            setValidDomain(domainIsValid);
          }
          setValidDomainLoading(false);
          setTimeout(() => {
            setDomainLoading(false);
          }, 5000);
        }
      }
    } catch (error) {
      setDomainLoading(false);
      console.error(error);
    }
  }

  const currentDeploymentIp = deploymentIp(projectId);

  return (
    <>
      <div className="w-full flex justify-between items-start">
        <h1 className="text-2xl font-bold mb-6">
          {currentDeploymentIp ? (
            <Link
              className="text-blue-400 hover:text-blue-400/80 "
              href={`https://${currentDeploymentIp}`}
              target="blank"
            >
              https://{currentDeploymentIp}
            </Link>
          ) : domain ? (
            <Link
              className="text-blue-400 hover:text-blue-400/80"
              href={`https://${domain}`}
              target="blank"
            >
              https://{domain}
            </Link>
          ) : (
            "New Project"
          )}
        </h1>
        {(currentDeploymentIp || domain) && (
          <Button onClick={() => setShowEdit((prev) => !prev)}>
            {showEdit ? "Hide" : "Edit"}
          </Button>
        )}
      </div>
      {showEdit && (
        <div className="bg-zinc-900 rounded p-4 mb-6 flex flex-col gap-2">
          <p>Edit subdomain</p>
          <div className="w-full flex gap-3">
            <input
              className="w-full bg-zinc-900 rounded px-3 py-2 border border-zinc-800 text-white "
              placeholder={`Enter subdomain only`}
              onChange={(e) => setNewSubDomain(e.target.value)}
            ></input>
            <Button
              onClick={handleEditDomain}
              disabled={!newSubDomain}
              loading={domainLoading}
            >
              Apply
            </Button>
          </div>
          <div className="flex gap-2 items-center mt-5">
            {domainLoading && (
              <>
                {validDomainLoading ? (
                  <>
                    <LoadingSpinner />
                    <p>
                      Checking if{" "}
                      <span className="font-medium text-blue-400">
                        {newSubDomain}
                      </span>{" "}
                      is available
                    </p>
                  </>
                ) : validDomain ? (
                  <>
                    <Available />
                    <p>
                      Subdomain{" "}
                      <span className="font-medium text-blue-400">
                        {newSubDomain}
                      </span>{" "}
                      is available
                    </p>
                  </>
                ) : (
                  <>
                    <NotAvailable />
                    <p>
                      Subdomain{" "}
                      <span className="font-medium text-blue-400">
                        {newSubDomain}
                      </span>{" "}
                      is not available
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default EditDomain;
