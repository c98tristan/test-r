"use strict";
// Use this code snippet in your app.
// If you need more information about configurations or implementing the sample code, visit the AWS docs:
// https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started.html
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSecret = void 0;
const client_secrets_manager_1 = require("@aws-sdk/client-secrets-manager");
const secret_name = 'ramper_keyshare';
const client = new client_secrets_manager_1.SecretsManagerClient({
    region: 'ap-southeast-1',
});
let response;
const getSecret = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        response = yield client.send(new client_secrets_manager_1.GetSecretValueCommand({
            SecretId: secret_name,
            VersionStage: 'AWSCURRENT', // VersionStage defaults to AWSCURRENT if unspecified
        }));
    }
    catch (error) {
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        throw error;
    }
    const secret = response.SecretString;
    return secret;
});
exports.getSecret = getSecret;
