import { useEffect } from "react";
import useProperties from "../../hooks/useProperties";
import PropertyCard from "../../components/PropertyCard/PropertyCard";
import "./UpdatePropertyStyle.css";

const UpdateProperty = () => {

  const { data, isLoading } = useProperties();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    data?.filter((property) => property.userEmail === user.email);
  }, [data]);

  if (isLoading) {
    return (
      <div>Loading...</div>
    );
  }

	return (
    <div className="paddings flexCenter properties">
      {
        data.map((property, i) => {
          return (
            <PropertyCard card={property} forUpdate={true} key={i} />
          )
        })
      }
    </div>
  );
};

export default UpdateProperty;
