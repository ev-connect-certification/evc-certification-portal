import {NextApiHandler} from "next";
import {res200, res400, res404, res500} from "../../lib/apiResponses";
import {supabaseAdmin} from "../../lib/supabaseAdmin";
import {TestObj} from "../../lib/types";

const handler: NextApiHandler = async (req, res) => {
    if (!(req.body.event && req.body.time && req.body.payload)) return res400(res);

    const payload = req.body.payload;

    console.log(payload);

    const event = payload.event;
    const {start_time} = event;

    const questions = payload.questions_and_answers;

    if (!(questions && questions.length)) return res400(res);

    const chargePointIdQuestion = questions.find(d => d.question === "Charge Point ID");
    const rfidIdsQuestion = questions.find(d => d.question === "RFID IDs");
    const testIdQuestion = questions.find(d => d.question === "Test ID");

    if ([start_time, chargePointIdQuestion, rfidIdsQuestion, testIdQuestion].includes(undefined)) return res400(res);

    try {
        const {data: testData, error: testError} = await supabaseAdmin
            .from("tests")
            .select("id")
            .eq("id", testIdQuestion.answer);

        if (testError) throw testError;

        if (!(testData && testData.length)) return res404(res);

        const {data, error} = await supabaseAdmin
            .from<TestObj>("tests")
            .update({
                chargePointId: chargePointIdQuestion.answer,
                rfidIds: rfidIdsQuestion.answer,
                testDate: start_time,
                status: "scheduled",
            })
            .eq("id", testIdQuestion.answer);

        if (error) throw error;

        return res200(res, {});
    } catch (e) {
        return res500(res, e);
    }
}