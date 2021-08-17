import {NextApiHandler} from "next";
import {supabaseAdmin} from "../../lib/supabaseAdmin";
import {CertificationRequestObj, ModelObj} from "../../lib/types";
import generator from "generate-password";
import {res200, res400, res403, res405, res500} from "../../lib/apiResponses";

const handler: NextApiHandler = async (req, res) => {
    if (req.method !== "POST") return res405(res);

    if (!(req.body.accessCode && req.body.accessCode === process.env.REQUEST_ACCESS_CODE)) return res403(res);

    if (req.body.isHardware === undefined) return res400(res);

    let checkParams = [req.body.name, req.body.email, req.body.firmwareVersion, req.body.manufacturerId, req.body.tier, req.body.team];

    checkParams = req.body.isHardware ? [
        ...checkParams,
        req.body.modelName,
        req.body.connectors,
        (req.body.isCreditCard && req.body.cardBrand && req.body.paymentFeatures),
        req.body.powerLevel,
        req.body.mountType,
        req.body.isConcurrent,
        req.body.certificationSupport,
        req.body.featureSupport,
        req.body.isWifi,
        req.body.isSIM,
        req.body.isHubSatellite,
        req.body.isWSSSingle,
    ] : [
        ...checkParams,
        req.body.modelIds,
        req.body.firmwareInfo,
        req.body.nextUpdate,
        req.body.isFirmwareResponsibility,
    ];

    if (req.body.team === "sales") checkParams = [
        ...checkParams,
        req.body.businessValue,
        req.body.amountBusiness,
        req.body.urgencyLevel,
        req.body.isContractSigned,
        req.body.shipDate,
    ];

    if (checkParams.includes(undefined)) return res400(res);

    try {
        let modelIds = req.body.modelIds;

        const {name, email, team, firmwareVersion, tier, manufacturerId, isHardware} = req.body;

        // if new hardware, create model and update model ID
        if (isHardware) {
            const {
                modelName,
                connectors,
                isCreditCard,
                cardBrand,
                paymentFeatures,
                powerLevel,
                mountType,
                isConcurrent,
                certificationSupport,
                featureSupport,
                isWifi,
                isSIM,
                isHubSatellite,
                isWSSSingle,
                updateFrequency,
            } = req.body;

            const newModel = {
                manufacturerId: manufacturerId,
                name: modelName,
                connectors: connectors,
                isCreditCard: isCreditCard,
                cardBrand: cardBrand,
                paymentFeatures: paymentFeatures || [],
                powerLevel: powerLevel,
                mountType: mountType,
                isConcurrent: isConcurrent,
                certificationSupport: certificationSupport || [],
                featureSupport: featureSupport || [],
                fileKeys: [],
                isWifi: isWifi,
                isSIM: isSIM,
                isHubSatellite: isHubSatellite,
                isWSSSingle: isWSSSingle,
                updateFrequency: updateFrequency,
            }

            const {data: modelData, error: modelError} = await supabaseAdmin.from<ModelObj>("models")
                .insert([newModel]);

            if (modelError) throw modelError;

            if (!(modelData && modelData.length)) return res500(res, new Error("Failed to create model"));

            modelIds = [modelData[0].id];
        }

        let newRequest: Partial<CertificationRequestObj> = {
            isHardware: isHardware,
            requesterName: name,
            requesterEmail: email,
            requesterTeam: team,
            firmwareVersion,
            tier,
            manufacturerId,
            accessCode: generator.generate({length: 6, numbers: true,}),
        }

        if (team === "sales") {
            const {businessValue, amountBusiness, urgencyLevel, isContractSigned, shipDate} = req.body;

            newRequest = {
                ...newRequest,
                businessValue,
                amountBusiness,
                urgencyLevel,
                isContractSigned,
                shipDate: shipDate,
            };
        }

        if (!isHardware) {
            const {firmwareInfo, nextUpdate, isFirmwareResponsibility} = req.body;

            newRequest = {
                ...newRequest,
                firmwareInfo: firmwareInfo,
                nextUpdate: nextUpdate,
                isFirmwareResponsibility: isFirmwareResponsibility,
            }
        }

        const {data, error} = await supabaseAdmin
            .from<CertificationRequestObj>("requests")
            .insert([newRequest]);

        if (error) throw error;

        if (!(data && data.length)) throw "Failed to create model";

        const {data: linkData, error: linkError} = await supabaseAdmin
            .from("requestModelLinks")
            .insert(modelIds.map(d => ({
                modelId: d,
                requestId: data[0].id,
            })));

        if (linkError) throw linkError;

        return res200(res, {data: data[0]});
    } catch (e) {
        return res500(res, e);
    }
}

export default handler;