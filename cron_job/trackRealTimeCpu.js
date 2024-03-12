import pkg from 'node-os-utils';
import { spawn } from "child_process";
import { pid } from 'process';
const { cpu: _cpu } = pkg;

const exec = (commands) => {
    spawn(commands, { stdio: "inherit", shell: true, detached: true });
};
export const cpuUsage = () => {
    _cpu.usage()
        .then(cpuPercentage => {
            console.log(`CPU utilization`, cpuPercentage)
            if (cpuPercentage >= 70) {
                console.log(`CPU utilization going on more than 70 percentage ${pid}`)
                exec(`taskkill /F /IM node.exe`)
                exec("npm run start");

            }
        })
}
