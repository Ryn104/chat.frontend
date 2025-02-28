import React, { useState, useEffect } from "react";
import photos from "../assets/image.js";

const Description = ({onBackDesc}) => {
    const receiverName = localStorage.getItem("receiverName") || "Unknown";
    const receiverDivisi = localStorage.getItem("receiverDivisi") || "Unknown";
    const receiverImg = localStorage.getItem("receiverImg") || "Unknown";
    const receiverEmail = localStorage.getItem("receiverEmail") || "Unknown";

    const generateDefaultAvatar = (name) => {
        const words = name.split(" ");
        let avatarText = "";

        if (words.length >= 2) {
            // Take the first letter of the first two words
            avatarText = words[0].charAt(0) + words[1].charAt(0);
        } else if (words.length === 1) {
            // Take the first two letters of the single word
            avatarText = words[0].substring(0, 2);
        }

        return avatarText.toUpperCase(); // Convert to uppercase
    };
    return (
        <div className="flex justify-center border-l border-gray-700 h-full">
            <div className="mt-10 w-full">
                <div className="flex xl:px-10 pt-2 pb-10 justify-between w-full border-b mb-5 border-gray-700">
                    <div className="flex gap-6">
                        {receiverImg === "http://127.0.0.1:8000/storage" ? (
                            <div className="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-xl">
                                {generateDefaultAvatar(receiverName)}
                            </div>
                        ) : (
                            <img
                                className="w-20 h-20 rounded-full"
                                src={receiverImg}
                                alt="profile"
                                onError={(e) => {
                                    // If the image fails to load, display the default avatar
                                    e.target.style.display = "none";
                                    e.target.parentElement.innerHTML = `
                                <div class="w-20 h-20 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-xl">
                                    ${generateDefaultAvatar(receiverName)}
                                </div>
                                `;
                                }}
                            />
                        )}
                        <div className="self-center">
                            <h1 className="xl:text-2xl font-semibold">{receiverName}</h1>
                            <p className="xl:text-xl">{receiverDivisi}</p>
                        </div>
                    </div>
                    <div className="self-center" onClick={() => onBackDesc()}>
                        <img src={photos.back} alt="" className="w-12 h-12"/>
                    </div>
                </div>
                <div className="flex xl:px-10">
                    <div className="flex flex-col gap-4 w-full">
                        <div className="flex gap-4 w-full pt-4">
                            <img src={photos.classs} alt="" className="w-10 h-10 self-center" />
                            <div>
                                <h1 className="xl:text-xl font-semibold">XII TJKT 1</h1>
                                <p>Class</p>
                            </div>
                        </div>
                        <div className="flex gap-4 border-t border-gray-700 w-full pt-4">
                            <img src={photos.division} alt="" className="w-10 h-10 self-center" />
                            <div>
                                <h1 className="xl:text-xl font-semibold">{receiverDivisi}</h1>
                                <p>Division</p>
                            </div>
                        </div>
                        <div className="flex gap-4 border-t border-gray-700 w-full pt-4">
                            <img src={photos.email} alt="" className="w-10 h-10 self-center" />
                            <div>
                                <h1 className="xl:text-xl font-semibold">{receiverEmail}</h1>
                                <p>Email</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Description;