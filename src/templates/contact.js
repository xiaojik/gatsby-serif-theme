import React, { useContext, useState, } from "react";
import { navigate } from "gatsby";
import styled from "styled-components";
import { Box, Button } from "grommet";
import ReCaptcha from "react-google-recaptcha";
import { NotificationContext } from "../Notifications/NotificationProvider";

const isDev = process.env.NODE_ENV === "development";

const onRegisterSuccess = (navUrl) => {    
    navigate(navUrl);
};

const Form = styled.form`
    display: flex;
    flex-direction: column;
    max-width: 360px;
`;

const FormRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    margin: 8px 0 12px;
`;

const FormInput = styled.input`
    width: 240px;
`;

const fieldNames = {
    "name": "Name",
    "email": "Email",
}

const encode = (data) => Object.keys(data)
    .map((key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join("&");

const NewsletterForm = () => {
    const [fieldsState, setFields] = useState({ "name": "", "email": "" });
    const [recaptchaValue, setRecaptchaValue] = useState(null);
    const notificationContext = useContext(NotificationContext);
	
    const setError = (text) =>
        notificationContext.setNotification({
            isError: true,
            text,
        });

    const onFieldChange = (e) =>
        setFields({
            ...fieldsState,
            [e.target.name]: e.target.value
        });

    const onSubmit = (e) => {
        e.preventDefault();

        const form = e.target,
            successUrl = form.getAttribute("action");

        notificationContext.setNotification(null);

        if (!Object.values(fieldsState).find((f) => !f)) {
            if (~document.location.host.indexOf("localhost")) {
                onRegisterSuccess(successUrl);
            }
            else {
                fetch("/", {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: encode({
                       ...fieldsState,
                        "g-recaptcha-response": recaptchaValue, //must set the recaptcha field or submissions will fail (without error)
                        "form-name": form.getAttribute("name"),
                    }),
                })
                    .then(() => {
                        if (response.status === 200 && !response.redirected) { //netlify doesnt give an error on recaptcha fail (only 303 redirect...) :(
                            onRegisterSuccess(successUrl);
                        }
			else{
			   console.log("!!!!!!!!!!! form server response: ", response);
			   setError("error occurred, please try again.");
			}
                    })
                    .catch(err => {
                        console.log("!!!!!!!!! FORM ERROR ", err);
                        setError("error occurred, please try again.");
                    });
            }
        }
        else {
            setError("please fill all fields");
        };
    };

    return (<Box
        gap="small"
        pad="small"
        elevation="medium"
        border={{ size: "medium", style: "groove" }}>
        <Form
            name="newsletter"
            action="/contact/newsletter-complete/"
            method="POST"
            data-netlify="true"            
            data-netlify-recaptcha="true"
            onSubmit={onSubmit}>

            <input type="hidden" name="form-name" value="newsletter" />            

	    <p> please register</p>
            <br />

            {Object.entries(fieldNames)
                .map(([field, name]) => <FormRow key={field}>
                    <label htmlFor={`nl-${field}`}>{name}:</label>
                    <FormInput id={`nl-${field}`} name={field} type="text" required
                        onChange={onFieldChange} />
                </FormRow>)}

	    <FormRow>
                <Button type="submit" primary label="Register" />
            </FormRow>

 	    {!isDev && <ReCaptcha
                sitekey={process.env.GATSBY_SITE_RECAPTCHA_KEY}
                onChange={setRecaptchaValue} />}            
        </Form>
    </Box>);
};

export default NewsletterForm;
