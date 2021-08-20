import {NextApiHandler} from "next";
import {supabaseAdmin} from "../../lib/supabaseAdmin";
import {res200, res400, res403, res404, res405, res500} from "../../lib/apiResponses";
import {generate} from "generate-password";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") return res405(res);

    const {chargePointId, rfidIds, scheduleTime, testId, newTest, requestId} = req.body;

    if (!(((!newTest && testId && scheduleTime) || (newTest && requestId)) && chargePointId && rfidIds)) return res400(res);

    if (!req.body.accessCode) return res403(res);

    try {
        if (newTest) {
            const {data, error} = await supabaseAdmin
                .from("tests")
                .insert([
                    {
                        accessCode: generate({length: 6, numbers: true}),
                        requestId: requestId,
                        status: "approved",
                        chargePointId: chargePointId,
                        rfidIds: rfidIds,
                    }
                ]);

            if (error) throw error;

            if (!(data && data.length)) throw new Error("Failed to create test");

            let thisTest = {...data[0]};

            delete thisTest.accessCode;

            return res200(res, data[0]);
        } else {
            const {data: testData, error: testError} = await supabaseAdmin
                .from("tests")
                .select("*")
                .eq("id", testId);

            if (testError) throw testError;

            if (!(testData && testData.length)) return res404(res);

            if (testData[0].accessCode !== req.body.accessCode) return res403(res);

            const {data, error} = await supabaseAdmin
                .from("tests")
                .update({
                    status: "scheduled",
                    chargePointId: chargePointId,
                    testDate: new Date(scheduleTime),
                    rfidIds: rfidIds,
                })
                .eq("id", testId);

            if (error) throw error;

            if (!(data && data.length)) throw new Error("Failed to update test");

            let thisTest = {...data[0]};

            delete thisTest.accessCode;

            return res200(res, data[0]);
        }
    } catch (e) {
        return res500(res, e);
    }
}

export default handler;