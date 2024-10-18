import "./styles/App.css";
import Header from "./atoms/header";
import { useEffect, useState } from "react";
import { storage } from "./config/firebase";
import {
	ref,
	getDownloadURL,
	uploadBytesResumable,
	listAll,
} from "firebase/storage";

function App() {
	const [imgUrl, setImgUrl] = useState<string | null>(null);
	const [progresspercent, setProgresspercent] =
		useState<number>(0);

	const handleSubmit = (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		const file = (e.currentTarget[0] as HTMLInputElement)
			.files?.[0];
		if (!file) return;

		const storageRef = ref(storage, `files/${file.name}`);
		const uploadTask = uploadBytesResumable(
			storageRef,
			file
		);

		uploadTask.on(
			"state_changed",
			(snapshot) => {
				const progress = Math.round(
					(snapshot.bytesTransferred /
						snapshot.totalBytes) *
						100
				);
				setProgresspercent(progress);
			},
			(error) => {
				alert(error);
			},
			() => {
				getDownloadURL(uploadTask.snapshot.ref).then(
					(downloadURL) => {
						setImgUrl(downloadURL);
					}
				);
			}
		);
	};

	useEffect(() => {
		// Create a reference to the "files" folder
		const storageRef = ref(storage, "files");
		console.log("Storage reference created:", storageRef);

		// Select the container element where you want to display the images
		const imagesContainer = document.querySelector(
			".images-container"
		) as HTMLElement;
		console.log("Images container found:", imagesContainer);

		// Check if the container is null
		if (!imagesContainer) {
			console.error("Error: Images container is null.");
			return;
		}

		// List all items (files and folders) in the "files" folder
		listAll(storageRef)
			.then((result) => {
				console.log(
					"List of items retrieved:",
					result.items
				);

				const imagePromises = result.items.map(
					(itemRef) => {
						const fileName = itemRef.name;
						const fileExtension = fileName
							.split(".")
							.pop()
							?.toLowerCase(); // Optional chaining
						console.log(
							"Processing file:",
							fileName,
							"with extension:",
							fileExtension
						);

						// Check if the file is an image
						const validImageExtensions = [
							"jpg",
							"jpeg",
							"png",
							"gif",
							"webp",
						];
						if (
							fileExtension &&
							validImageExtensions.includes(fileExtension)
						) {
							console.log("Valid image found:", fileName);

							// For each image item, get the download URL
							return getDownloadURL(itemRef).then((url) => {
								console.log(
									"Download URL for",
									fileName,
									":",
									url
								);

								// Create a new image element
								const imgElement =
									document.createElement("img");
								imgElement.src = url;
								imgElement.alt = fileName; // Set alt text for accessibility
								imgElement.className = "image-item"; // Add a class for styling

								// Append the image element to the container
								imagesContainer.appendChild(imgElement);
								console.log(
									"Image appended to container:",
									fileName
								);
							});
						}

						console.log(
							"Not a valid image file:",
							fileName
						);
						// Return a resolved promise for non-image files
						return Promise.resolve();
					}
				);

				// Wait for all image download URLs to be retrieved
				return Promise.all(imagePromises);
			})
			.then(() => {
				console.log(
					"All images processed and added to the container."
				);
			})
			.catch((error: Error) => {
				console.error(
					"Error listing images or getting URLs:",
					error
				);
			});
	}, []);

	return (
		<div className="App">
			<Header header="Upload an Image" />
			<form onSubmit={handleSubmit} className="form">
				<input className="fileSelect" type="file" />
				<button className="uploadButton" type="submit">
					Upload
				</button>
			</form>
			{!imgUrl && (
				<div className="outerbar">
					<div
						className="innerbar"
						style={{ width: `${progresspercent}%` }}
					>
						{progresspercent}%
					</div>
				</div>
			)}
			{imgUrl && (
				<img src={imgUrl} alt="uploaded file" width={200} />
			)}
			{/* Pull and render all previously uploaded images */}
			<div className="images-container"></div>
		</div>
	);
}

export default App;
