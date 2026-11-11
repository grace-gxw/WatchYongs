import { MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime } from "@/lib/format";
import { WHATSAPP_TEMPLATE_LABELS } from "@/lib/whatsapp-templates";

type WhatsappLogItem = {
  id: string;
  templateType: string;
  message: string;
  sentAt: Date;
};

export function WhatsappHistoryCard({ logs }: { logs: WhatsappLogItem[] }) {
  if (logs.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="size-4 text-emerald-600" />
          Riwayat WhatsApp
        </CardTitle>
        <CardDescription>Pesan yang sudah dibuka di WhatsApp untuk order ini.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="flex flex-col items-end gap-1">
            <div className="max-w-[90%] rounded-2xl rounded-tr-sm bg-emerald-50 px-3.5 py-2.5 ring-1 ring-emerald-600/10">
              <p className="mb-1 text-xs font-semibold text-emerald-800">
                {WHATSAPP_TEMPLATE_LABELS[log.templateType] ?? log.templateType}
              </p>
              <p className="line-clamp-3 text-sm whitespace-pre-line text-foreground/80">
                {log.message}
              </p>
            </div>
            <p className="pr-1 text-[11px] text-muted-foreground">{formatDateTime(log.sentAt)}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
