import {NextApiHandler} from "next";
import {res200, res400, res403, res404, res405, res500} from "../../lib/apiResponses";
import {supabase} from "../../lib/supabaseClient";
import {supabaseAdmin} from "../../lib/supabaseAdmin";
import axios from "axios";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") return res405(res);

    const {user} = await supabase.auth.api.getUserByCookie(req);

    if (!user) return res403(res);

    const {requestId, testId} = req.body;

    try {
        if (!requestId) return res400(res);

        const {data: requestData, error: requestError} = await supabaseAdmin.from("requests")
            .select("requesterName, requesterEmail, firmwareVersion, models (name, manufacturers (name))")
            .eq("id", requestId);

        if (requestError) throw requestError;

        if (!(requestData && requestData.length)) return res404(res);

        const {data: testData, error: testError} = await supabaseAdmin.from("tests")
            .select("accessCode")
            .eq("id", testId);

        if (testError) throw testError;

        if (!(testData && testData.length)) return res404(res);

        const emailData = {
            to: [{email: requestData[0].requesterEmail}],
            templateId: 2,
            params: {
                name: requestData[0].requesterName,
                model: requestData[0].models[0].manufacturers.name + " " + requestData[0].models[0].name,
                firmware: requestData[0].firmwareVersion,
                code: testData[0].accessCode,
                link: `https://certification.evconnect.com/request/${requestId}/${testId}`,
            }
        };

        await axios.post("https://api.sendinblue.com/v3/smtp/email", emailData, {
            headers: {
                "api-key": process.env.SENDINBLUE_API_KEY,
            },
        });

        return res200(res, {});
    } catch (e) {
        console.log(e);

        return res500(res, e);
    }

}

export default handler;