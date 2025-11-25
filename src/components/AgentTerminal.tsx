import { useEffect, useRef } from 'react';
import { Terminal } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import 'xterm/css/xterm.css';

interface AgentTerminalProps {
    logs: string[];
}

export default function AgentTerminal({ logs }: AgentTerminalProps) {
    const terminalRef = useRef<HTMLDivElement>(null);
    const xtermRef = useRef<Terminal | null>(null);

    useEffect(() => {
        if (!terminalRef.current || xtermRef.current) return;

        const term = new Terminal({
            cursorBlink: true,
            fontSize: 14,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            theme: {
                background: '#1e1e1e',
                foreground: '#ffffff',
            },
            rows: 20,
        });

        const fitAddon = new FitAddon();
        term.loadAddon(fitAddon);
        term.open(terminalRef.current);
        fitAddon.fit();

        xtermRef.current = term;

        return () => {
            term.dispose();
        };
    }, []);

    useEffect(() => {
        if (!xtermRef.current) return;

        // Clear and rewrite logs to keep sync
        xtermRef.current.clear();

        if (logs.length === 0) {
            xtermRef.current.writeln('\x1b[33mWaiting for agent...\x1b[0m');
        } else {
            logs.forEach(log => {
                // If log is a JSON chunk, maybe just print a dot or a status update to avoid spam
                // But for now, let's print it raw but truncated if too long
                if (log.length > 200) {
                    xtermRef.current?.write(log.substring(0, 200) + '...');
                } else {
                    xtermRef.current?.writeln(log);
                }
            });
        }
    }, [logs]);

    return <div ref={terminalRef} className="w-full h-full min-h-[300px] rounded-lg overflow-hidden" />;
}
