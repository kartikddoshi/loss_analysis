import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface InputCardProps {
  setLossFile: (file: File | null) => void;
  setWeightFile: (file: File | null) => void;
  uploadMode: 'add' | 'replace';
  setUploadMode: (mode: 'add' | 'replace') => void;
  handleUpload: () => void;
  handleClearDatabase: () => void;
  lossFile: File | null;
  weightFile: File | null;
}

const InputCard: React.FC<InputCardProps> = ({
  setLossFile,
  setWeightFile,
  uploadMode,
  setUploadMode,
  handleUpload,
  handleClearDatabase,
  lossFile,
  weightFile
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <Card>
        <CardHeader>Data Input</CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="lossFile">Loss Data File</Label>
              <Input id="lossFile" type="file" onChange={e => setLossFile(e.target.files?.[0] || null)} />
            </div>
            <div>
              <Label htmlFor="weightFile">Weight Data File</Label>
              <Input id="weightFile" type="file" onChange={e => setWeightFile(e.target.files?.[0] || null)} />
            </div>
            <div>
              <Label htmlFor="uploadMode">Upload Mode</Label>
              <Select value={uploadMode} onValueChange={(value: 'add' | 'replace') => setUploadMode(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select upload mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="add">Add to existing data</SelectItem>
                  <SelectItem value="replace">Replace existing data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="mt-4 flex justify-between">
              <Button onClick={handleUpload} disabled={!lossFile && !weightFile}>
                Upload
              </Button>
              <Button onClick={handleClearDatabase} variant="destructive">
                Clear Database
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InputCard;