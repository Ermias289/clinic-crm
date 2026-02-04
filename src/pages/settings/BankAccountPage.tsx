import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { 
  Plus, 
  Banknote, 
  Building, 
  CreditCard,
  Edit, 
  Trash2, 
  Loader2, 
  Copy,
  CheckCircle,
  Landmark,
  Upload,
  X,
  Image as ImageIcon
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { 
  Bank, 
  BankAccount, 
  AddBankDTO, 
  AddBankAccountDTO, 
  UpdateBankDTO, 
  UpdateBankAccountDTO,
  bankService,
  bankAccountService 
} from "@/lib/api/BankAccount";
import { fileUploadService } from "@/lib/api/fileUpload";

const BankAccountPage = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(true);
  const [isBankDialogOpen, setIsBankDialogOpen] = useState(false);
  const [isAccountDialogOpen, setIsAccountDialogOpen] = useState(false);
  const [editingBank, setEditingBank] = useState<Bank | null>(null);
  const [editingAccount, setEditingAccount] = useState<BankAccount | null>(null);
  const [selectedBankId, setSelectedBankId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [copiedAccountNumber, setCopiedAccountNumber] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states
  const [bankForm, setBankForm] = useState<AddBankDTO>({
    name: "",
    logo: ""
  });

  const [accountForm, setAccountForm] = useState<AddBankAccountDTO>({
    name: "",
    accountNumber: "",
    bankId: 0
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const banksData = await bankService.getAll();
      setBanks(banksData);
    } catch (error) {
      console.error("Failed to load banks:", error);
      toast({ 
        title: "Error", 
        description: "Failed to load banks. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, GIF, or WebP).",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB.",
        variant: "destructive"
      });
      return;
    }

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);

    // Upload file
    await uploadLogo(file);

    // Clean up file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      setUploadingLogo(true);
      const fileName = await fileUploadService.upload(file);
      
      setBankForm(prev => ({ ...prev, logo: fileName }));
      
      toast({
        title: "Logo uploaded",
        description: "Bank logo successfully uploaded to server",
      });
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload bank logo",
        variant: "destructive",
      });
      setLogoPreview(null);
    } finally {
      setUploadingLogo(false);
    }
  };

  const removeLogo = () => {
    setBankForm(prev => ({ ...prev, logo: "" }));
    setLogoPreview(null);
    if (logoPreview) {
      URL.revokeObjectURL(logoPreview);
    }
  };

  const getLogoUrl = (logoFileName: string) => {
    if (!logoFileName) return "";
    return fileUploadService.getFileUrl(logoFileName);
  };

  const handleCreateBank = async () => {
    if (!bankForm.name.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Bank name is required.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate names
    const duplicateName = banks.some(bank => 
      bank.name.toLowerCase() === bankForm.name.toLowerCase()
    );
    if (duplicateName) {
      toast({ 
        title: "Validation Error", 
        description: "A bank with this name already exists. Please choose a different name.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      await bankService.create(bankForm);
      
      toast({ title: "Success", description: "Bank created successfully." });
      setIsBankDialogOpen(false);
      setBankForm({ name: "", logo: "" });
      setLogoPreview(null);
      loadData();
    } catch (error: any) {
      console.error("Failed to create bank:", error);
      
      let errorMessage = "Failed to create bank. Please try again.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({ 
        title: "Error", 
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateBank = async () => {
    if (!editingBank) return;

    if (!bankForm.name.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Bank name is required.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate names (excluding current bank)
    const duplicateName = banks.some(bank => 
      bank.id !== editingBank.id && 
      bank.name.toLowerCase() === bankForm.name.toLowerCase()
    );
    if (duplicateName) {
      toast({ 
        title: "Validation Error", 
        description: "A bank with this name already exists. Please choose a different name.",
        variant: "destructive"
      });
      return;
    }

    try {
      setSubmitting(true);
      const updateData: UpdateBankDTO = {
        id: editingBank.id,
        ...bankForm
      };
      await bankService.update(updateData);
      
      toast({ title: "Success", description: "Bank updated successfully." });
      setEditingBank(null);
      setIsBankDialogOpen(false);
      setBankForm({ name: "", logo: "" });
      setLogoPreview(null);
      loadData();
    } catch (error: any) {
      console.error("Failed to update bank:", error);
      
      let errorMessage = "Failed to update bank. Please try again.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.status === 404) {
        errorMessage = "Bank not found. It may have been deleted by another user.";
      }
      
      toast({ 
        title: "Error", 
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!accountForm.name.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Account name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!accountForm.accountNumber.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Account number is required.",
        variant: "destructive"
      });
      return;
    }

    if (!accountForm.bankId) {
      toast({ 
        title: "Validation Error", 
        description: "Please select a bank.",
        variant: "destructive"
      });
      return;
    }

    // Find the selected bank
    const selectedBank = banks.find(bank => bank.id === accountForm.bankId);
    if (selectedBank) {
      // Check for duplicate account numbers in this bank
      const duplicateAccount = selectedBank.bankAccounts.some(account => 
        account.accountNumber === accountForm.accountNumber
      );
      if (duplicateAccount) {
        toast({ 
          title: "Validation Error", 
          description: "An account with this number already exists in this bank.",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      setSubmitting(true);
      await bankAccountService.create(accountForm);
      
      toast({ title: "Success", description: "Bank account created successfully." });
      setIsAccountDialogOpen(false);
      setAccountForm({ name: "", accountNumber: "", bankId: 0 });
      loadData();
    } catch (error: any) {
      console.error("Failed to create bank account:", error);
      
      let errorMessage = "Failed to create bank account. Please try again.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      toast({ 
        title: "Error", 
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAccount = async () => {
    if (!editingAccount) return;

    if (!accountForm.name.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Account name is required.",
        variant: "destructive"
      });
      return;
    }

    if (!accountForm.accountNumber.trim()) {
      toast({ 
        title: "Validation Error", 
        description: "Account number is required.",
        variant: "destructive"
      });
      return;
    }

    if (!accountForm.bankId) {
      toast({ 
        title: "Validation Error", 
        description: "Please select a bank.",
        variant: "destructive"
      });
      return;
    }

    // Check for duplicate account numbers (excluding current account)
    const selectedBank = banks.find(bank => bank.id === accountForm.bankId);
    if (selectedBank) {
      const duplicateAccount = selectedBank.bankAccounts.some(account => 
        account.id !== editingAccount.id && 
        account.accountNumber === accountForm.accountNumber
      );
      if (duplicateAccount) {
        toast({ 
          title: "Validation Error", 
          description: "An account with this number already exists in this bank.",
          variant: "destructive"
        });
        return;
      }
    }

    try {
      setSubmitting(true);
      const updateData: UpdateBankAccountDTO = {
        id: editingAccount.id,
        ...accountForm
      };
      await bankAccountService.update(updateData);
      
      toast({ title: "Success", description: "Bank account updated successfully." });
      setEditingAccount(null);
      setIsAccountDialogOpen(false);
      setAccountForm({ name: "", accountNumber: "", bankId: 0 });
      loadData();
    } catch (error: any) {
      console.error("Failed to update bank account:", error);
      
      let errorMessage = "Failed to update bank account. Please try again.";
      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.status === 404) {
        errorMessage = "Bank account not found. It may have been deleted by another user.";
      }
      
      toast({ 
        title: "Error", 
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteBank = async (bank: Bank) => {
    if (!confirm(`Are you sure you want to delete "${bank.name}"? This will also delete all associated bank accounts. This action cannot be undone.`)) {
      return;
    }

    try {
      await bankService.delete(bank.id);
      toast({ title: "Success", description: "Bank deleted successfully." });
      loadData();
    } catch (error) {
      console.error("Failed to delete bank:", error);
      toast({ 
        title: "Error", 
        description: "Failed to delete bank. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async (account: BankAccount, bankName: string) => {
    if (!confirm(`Are you sure you want to delete "${account.name}" from ${bankName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await bankAccountService.delete(account.id);
      toast({ title: "Success", description: "Bank account deleted successfully." });
      loadData();
    } catch (error) {
      console.error("Failed to delete bank account:", error);
      toast({ 
        title: "Error", 
        description: "Failed to delete bank account. Please try again.",
        variant: "destructive"
      });
    }
  };

  const openBankDialog = (bank?: Bank) => {
    if (bank) {
      setBankForm({ name: bank.name, logo: bank.logo });
      setEditingBank(bank);
      if (bank.logo) {
        setLogoPreview(getLogoUrl(bank.logo));
      } else {
        setLogoPreview(null);
      }
    } else {
      setBankForm({ name: "", logo: "" });
      setEditingBank(null);
      setLogoPreview(null);
    }
    setIsBankDialogOpen(true);
  };

  const openAccountDialog = (bankId?: number, account?: BankAccount) => {
    if (account) {
      setAccountForm({
        name: account.name,
        accountNumber: account.accountNumber,
        bankId: account.bankId
      });
      setEditingAccount(account);
      setSelectedBankId(account.bankId);
    } else if (bankId) {
      setAccountForm({ name: "", accountNumber: "", bankId });
      setSelectedBankId(bankId);
      setEditingAccount(null);
    } else {
      setAccountForm({ name: "", accountNumber: "", bankId: 0 });
      setSelectedBankId(null);
      setEditingAccount(null);
    }
    setIsAccountDialogOpen(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccountNumber(text);
    toast({ title: "Copied!", description: "Account number copied to clipboard." });
    
    setTimeout(() => {
      setCopiedAccountNumber(null);
    }, 2000);
  };

  const formatAccountNumber = (accountNumber: string) => {
    // Format as XXXX-XXXX-XXXX-XXXX or similar
    return accountNumber.replace(/(\d{4})(?=\d)/g, '$1-');
  };

  if (loading) {
    return (
      <DashboardLayout title="Bank Accounts" subtitle="Manage banks and their accounts">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Bank Accounts" 
      subtitle="Manage banks and their accounts"
      actions={
        <div className="flex gap-2">
          <Dialog open={isBankDialogOpen} onOpenChange={setIsBankDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={() => openBankDialog()}>
                <Building className="w-4 h-4 mr-2" /> Add Bank
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingBank ? 'Edit Bank' : 'Add New Bank'}</DialogTitle>
                <DialogDescription>
                  {editingBank ? 'Update bank information' : 'Add a new bank to the system'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {/* Logo Upload Section */}
                <div className="space-y-3">
                  <Label>Bank Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted/50">
                        {logoPreview ? (
                          <div className="relative group">
                            <img 
                              src={logoPreview} 
                              alt="Bank logo preview" 
                              className="w-full h-full object-cover"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              className="absolute -top-2 -right-2 w-6 h-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={removeLogo}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ) : (
                          <ImageIcon className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="space-y-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={handleFileSelect}
                          disabled={uploadingLogo}
                          className="w-full"
                        >
                          {uploadingLogo ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Uploading...
                            </>
                          ) : (
                            <>
                              <Upload className="w-4 h-4 mr-2" />
                              {logoPreview ? 'Change Logo' : 'Upload Logo'}
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground">
                          Upload bank logo (JPEG, PNG, GIF, WebP, max 5MB)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Bank Name *</Label>
                  <Input 
                    placeholder="Commercial Bank of Ethiopia" 
                    value={bankForm.name}
                    onChange={(e) => setBankForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsBankDialogOpen(false);
                    setBankForm({ name: "", logo: "" });
                    setLogoPreview(null);
                    setEditingBank(null);
                  }}
                  disabled={submitting || uploadingLogo}
                >
                  Cancel
                </Button>
                <Button 
                  variant="dental" 
                  onClick={editingBank ? handleUpdateBank : handleCreateBank}
                  disabled={submitting || uploadingLogo}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingBank ? 'Save Changes' : 'Create Bank'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAccountDialogOpen} onOpenChange={setIsAccountDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="dental" onClick={() => openAccountDialog()}>
                <CreditCard className="w-4 h-4 mr-2" /> Add Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{editingAccount ? 'Edit Bank Account' : 'Add New Bank Account'}</DialogTitle>
                <DialogDescription>
                  {editingAccount ? 'Update bank account information' : 'Add a new account to a bank'}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>Select Bank *</Label>
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={accountForm.bankId || ""}
                    onChange={(e) => setAccountForm(prev => ({ 
                      ...prev, 
                      bankId: parseInt(e.target.value) || 0 
                    }))}
                  >
                    <option value="">Select a bank</option>
                    {banks.map(bank => (
                      <option key={bank.id} value={bank.id}>
                        {bank.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Account Name *</Label>
                  <Input 
                    placeholder="Main Business Account" 
                    value={accountForm.name}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Number *</Label>
                  <Input 
                    placeholder="1000590778331" 
                    value={accountForm.accountNumber}
                    onChange={(e) => setAccountForm(prev => ({ ...prev, accountNumber: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsAccountDialogOpen(false);
                    setAccountForm({ name: "", accountNumber: "", bankId: 0 });
                    setEditingAccount(null);
                  }}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button 
                  variant="dental" 
                  onClick={editingAccount ? handleUpdateAccount : handleCreateAccount}
                  disabled={submitting}
                >
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {editingAccount ? 'Save Changes' : 'Create Account'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      }
    >
      {banks.length === 0 ? (
        <div className="text-center py-12">
          <Landmark className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No banks found</h3>
          <p className="text-muted-foreground mb-4">Get started by adding your first bank.</p>
          <Button variant="dental" onClick={() => openBankDialog()}>
            <Building className="w-4 h-4 mr-2" /> Add Bank
          </Button>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-4">
          {banks.map((bank) => (
            <Card key={bank.id} className="overflow-hidden">
              <AccordionItem value={`bank-${bank.id}`} className="border-0">
                <div className="flex items-center justify-between p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center overflow-hidden">
                      {bank.logo ? (
                        <img 
                          src={getLogoUrl(bank.logo)} 
                          alt={`${bank.name} logo`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to icon if image fails to load
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            target.parentElement!.innerHTML = '<Building className="w-6 h-6 text-primary" />';
                          }}
                        />
                      ) : (
                        <Building className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <CardTitle>{bank.name}</CardTitle>
                      <CardDescription>
                        {bank.bankAccounts.length} account{bank.bankAccounts.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AccordionTrigger className="p-0 [&>svg]:w-5 [&>svg]:h-5" />
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => openBankDialog(bank)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDeleteBank(bank)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <AccordionContent>
                  <div className="px-6 pb-6 border-t pt-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium">Bank Accounts</h4>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openAccountDialog(bank.id)}
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Account
                      </Button>
                    </div>
                    
                    {bank.bankAccounts.length === 0 ? (
                      <div className="text-center py-8 border rounded-lg">
                        <Banknote className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">No accounts for this bank</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bank.bankAccounts.map((account) => (
                          <Card key={account.id} className="relative overflow-hidden">
                            <div className="h-1 bg-gradient-to-r from-primary/60 to-primary" />
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between">
                                <div>
                                  <CardTitle className="text-base">{account.name}</CardTitle>
                                  <CardDescription className="mt-1">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono">
                                        {formatAccountNumber(account.accountNumber)}
                                      </span>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-6 w-6"
                                        onClick={() => copyToClipboard(account.accountNumber)}
                                      >
                                        {copiedAccountNumber === account.accountNumber ? (
                                          <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                                        ) : (
                                          <Copy className="w-3.5 h-3.5" />
                                        )}
                                      </Button>
                                    </div>
                                  </CardDescription>
                                </div>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="flex gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="flex-1"
                                  onClick={() => openAccountDialog(bank.id, account)}
                                >
                                  <Edit className="w-4 h-4 mr-1" /> Edit
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteAccount(account, bank.name)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Card>
          ))}
        </Accordion>
      )}
    </DashboardLayout>
  );
};

export default BankAccountPage;