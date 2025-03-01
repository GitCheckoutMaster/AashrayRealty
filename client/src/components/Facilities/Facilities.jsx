import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Group, NumberInput, Select } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { useContext } from "react";
import UserDetailContext from "../../context/UserDetailContext";
import useProperties from "../../hooks/useProperties.jsx";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { createResidency, updateResidency } from "../../utils/api";

const Facilities = ({
	prevStep,
	propertyDetails,
	setPropertyDetails,
	setOpened,
	setActiveStep,
	forUpdate = undefined,
}) => {
	const form = useForm({
		initialValues: {
			bedrooms: propertyDetails.facilities.bedrooms,
			parkings: propertyDetails.facilities.parkings,
			bathrooms: propertyDetails.facilities.bathrooms,
			propertyType: propertyDetails.propertyType,
		},
		validate: {
			bedrooms: (value) => (value < 1 ? "Must have at least one room" : null),
			bathrooms: (value) =>
				value < 1 ? "Must have at least one bathroom" : null,
		},
	});

	const { bedrooms, parkings, bathrooms, propertyType } = form.values;

	const handleSubmit = () => {
		const { hasErrors } = form.validate();
		if (forUpdate) {
      updateMutate();
    } else if (!hasErrors) {
			setPropertyDetails((prev) => ({
				...prev,
				facilities: { bedrooms, parkings, bathrooms },
				propertyType,
			}));
			mutate();
		}
	};

	// ==================== upload logic
	const { user } = useAuth0();
	const {
		userDetails: { token },
	} = useContext(UserDetailContext);
	const { refetch: refetchProperties } = useProperties();

  const { mutate: updateMutate } = useMutation({
    mutationFn: () => {
      updateResidency(
        {
          ...propertyDetails,
          facilities: { bedrooms, parkings, bathrooms },
          propertyType,
        },
        forUpdate.id,
        token
      );
    },
    onError: ({ response }) =>
      toast.error(response.data.message, { position: "bottom-right" }),
    onSettled: () => {
      toast.success("Updated Successfully", { position: "bottom-right" });
      setPropertyDetails({
        title: "",
        description: "",
        price: 0,
        country: "",
        city: "",
        address: "",
        images: null,
        facilities: {
          bedrooms: 0,
          parkings: 0,
          bathrooms: 0,
        },
        propertyType: "for sale",
        userEmail: user?.email,
      });
      setOpened(false);
      setActiveStep(0);
      refetchProperties();
    }
  });

	const { mutate, isLoading } = useMutation({
		mutationFn: () => {
			console.log("propertyDetails", propertyDetails);
			createResidency(
				{
					...propertyDetails,
					facilities: { bedrooms, parkings, bathrooms },
					propertyType,
				},
				token
			);
		},
		onError: ({ response }) =>
			toast.error(response.data.message, { position: "bottom-right" }),
		onSettled: () => {
			toast.success("Added Successfully", { position: "bottom-right" });
			setPropertyDetails({
				title: "",
				description: "",
				price: 0,
				country: "",
				city: "",
				address: "",
				images: null,
				facilities: {
					bedrooms: 0,
					parkings: 0,
					bathrooms: 0,
				},
				propertyType: "for sale",
				userEmail: user?.email,
			});
			setOpened(false);
			setActiveStep(0);
			refetchProperties();
		},
	});

	return (
		<Box maw="30%" mx="auto" my="sm">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<NumberInput
					withAsterisk
					label="No of Bedrooms"
					min={0}
					{...form.getInputProps("bedrooms")}
				/>
				<NumberInput
					label="No of Parkings"
					min={0}
					{...form.getInputProps("parkings")}
				/>
				<NumberInput
					withAsterisk
					label="No of Bathrooms"
					min={0}
					{...form.getInputProps("bathrooms")}
				/>
				<Select
					label="Property Type"
					data={[
						{ label: "For Sale", value: "for sale" },
						{ label: "For Rent", value: "for rent" },
					]}
					{...form.getInputProps("propertyType")}
				/>
				<Group position="center" mt="xl">
					<Button variant="default" onClick={prevStep}>
						Back
					</Button>
					<Button type="submit" color="green" disabled={isLoading}>
						{isLoading ? "Submitting" : "Add Property"}
					</Button>
				</Group>
			</form>
		</Box>
	);
};

export default Facilities;
