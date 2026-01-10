import { useState, useEffect } from "react";
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
import { Image as ImageIcon, Plus, Edit, Trash2, Upload, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { bannersService, Banner } from "@/lib/api/banners";
import { fileUploadService } from "@/lib/api/fileUpload";

const OnboardingSettingsPage = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateBannerOpen, setIsCreateBannerOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [newBannerImage, setNewBannerImage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);
  const [editBannerData, setEditBannerData] = useState({
    image: "",
    isActive: true
  });
  const [editSelectedFile, setEditSelectedFile] = useState<File | null>(null);
  const [editPreviewUrl, setEditPreviewUrl] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<Banner | null>(null);

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true);
        const data = await bannersService.getAll();
        setBanners(data);
      } catch (error) {
        console.error('Failed to fetch banners:', error);
        toast({
          title: "Error",
          description: "Failed to load banners. Please check your permissions.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleCreateBanner = async () => {
    try {
      let imageUrl = newBannerImage.trim();

      // If a file is selected, upload it first
      if (selectedFile) {
        setUploading(true);
        try {
          console.log('Uploading file:', selectedFile.name);
          const fileName = await fileUploadService.upload(selectedFile);
          console.log('Upload response:', fileName, 'Type:', typeof fileName);
          imageUrl = fileName; // Use the returned filename
        } catch (uploadError) {
          console.error('Failed to upload file:', uploadError);
          toast({
            title: "Upload Error",
            description: "Failed to upload the image file.",
            variant: "destructive"
          });
          return;
        } finally {
          setUploading(false);
        }
      }

      if (!imageUrl) {
        toast({
          title: "Error",
          description: "Please provide an image URL or select a file.",
          variant: "destructive"
        });
        return;
      }

      console.log('Final image URL being sent to banner API:', imageUrl, 'Type:', typeof imageUrl);
      await bannersService.add(imageUrl);
      
      // Refresh banners list
      const data = await bannersService.getAll();
      setBanners(data);
      
      // Reset form
      setIsCreateBannerOpen(false);
      setNewBannerImage("");
      setSelectedFile(null);
      setPreviewUrl("");
      
      toast({ 
        title: "Banner created", 
        description: "Banner has been added successfully." 
      });
    } catch (error) {
      console.error('Failed to create banner:', error);
      toast({
        title: "Error",
        description: "Failed to create banner. You may not have permission to add banners.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateBanner = async () => {
    if (!selectedBanner) return;

    try {
      let imageUrl = editBannerData.image;

      // If a new file is selected, upload it first
      if (editSelectedFile) {
        setUploading(true);
        try {
          const fileName = await fileUploadService.upload(editSelectedFile);
          imageUrl = fileName; // Use the returned filename
        } catch (uploadError) {
          console.error('Failed to upload file:', uploadError);
          toast({
            title: "Upload Error",
            description: "Failed to upload the image file.",
            variant: "destructive"
          });
          return;
        } finally {
          setUploading(false);
        }
      }

      await bannersService.update(selectedBanner.id, imageUrl, editBannerData.isActive);
      
      // Refresh banners list
      const data = await bannersService.getAll();
      setBanners(data);
      
      // Reset form
      setSelectedBanner(null);
      setEditBannerData({ image: "", isActive: true });
      setEditSelectedFile(null);
      setEditPreviewUrl("");
      
      toast({ 
        title: "Banner updated", 
        description: "Banner has been updated successfully." 
      });
    } catch (error) {
      console.error('Failed to update banner:', error);
      toast({
        title: "Error",
        description: "Failed to update banner. You may not have permission to edit banners.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteBanner = async (bannerId: number) => {
    try {
      await bannersService.remove(bannerId);
      
      // Refresh banners list
      const data = await bannersService.getAll();
      setBanners(data);
      
      toast({ 
        title: "Banner deleted", 
        description: "Banner has been removed successfully." 
      });
    } catch (error) {
      console.error('Failed to delete banner:', error);
      toast({
        title: "Error",
        description: "Failed to delete banner. You may not have permission to remove banners.",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setBannerToDelete(null);
    }
  };

  const confirmDeleteBanner = (banner: Banner) => {
    setBannerToDelete(banner);
    setDeleteDialogOpen(true);
  };

  const openEditDialog = (banner: Banner) => {
    setSelectedBanner(banner);
    setEditBannerData({
      image: banner.image,
      isActive: banner.isActive
    });
    setEditSelectedFile(null);
    setEditPreviewUrl("");
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewBannerImage(""); // Clear URL input when file is selected
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleEditFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setEditSelectedFile(file);
      setEditBannerData(prev => ({ ...prev, image: "" })); // Clear URL input when file is selected
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setEditPreviewUrl(url);
    }
  };

  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return "";
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a filename from upload, use the file service to get the URL
    return fileUploadService.getFileUrl(imagePath);
  };

  return (
    <DashboardLayout title="User Onboarding" subtitle="Configure patient registration and onboarding flow">
      <div className="max-w-4xl space-y-6">
        {/* Banner Management Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Onboarding Banners
                </CardTitle>
                <CardDescription>Manage banners displayed during patient onboarding</CardDescription>
              </div>
              <Dialog open={isCreateBannerOpen} onOpenChange={setIsCreateBannerOpen}>
                <DialogTrigger asChild>
                  <Button variant="dental">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Banner
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Banner</DialogTitle>
                    <DialogDescription>Add a new banner for the onboarding flow</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label>Upload Image File</Label>
                      <div className="flex items-center gap-2">
                        <Input 
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="flex-1"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose File
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Select an image file from your computer (JPG, PNG, GIF)
                      </p>
                    </div>
                    
                    <div className="text-center text-sm text-muted-foreground">
                      — OR —
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Image URL</Label>
                      <Input 
                        placeholder="https://example.com/banner.jpg" 
                        value={newBannerImage}
                        onChange={(e) => {
                          setNewBannerImage(e.target.value);
                          if (e.target.value) {
                            setSelectedFile(null);
                            setPreviewUrl("");
                          }
                        }}
                        disabled={!!selectedFile}
                      />
                      <p className="text-xs text-muted-foreground">
                        Or provide a direct URL to an image
                      </p>
                    </div>

                    {/* Preview */}
                    {(previewUrl || newBannerImage) && (
                      <div className="space-y-2">
                        <Label>Preview</Label>
                        <div className="w-full h-32 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden border">
                          <img 
                            src={previewUrl || newBannerImage} 
                            alt="Banner preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `
                                  <div class="text-muted-foreground text-center">
                                    <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                    </svg>
                                    <p class="text-sm">Failed to load image</p>
                                  </div>
                                `;
                              }
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => {
                      setIsCreateBannerOpen(false);
                      setNewBannerImage("");
                      setSelectedFile(null);
                      setPreviewUrl("");
                    }}>Cancel</Button>
                    <Button 
                      variant="dental" 
                      onClick={handleCreateBanner}
                      disabled={uploading || (!newBannerImage && !selectedFile)}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        "Add Banner"
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading banners...</span>
              </div>
            ) : banners.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No banners configured</p>
                <p className="text-sm mt-2">Add banners to display during patient onboarding</p>
              </div>
            ) : (
              <div className="space-y-3">
                {banners.map((banner) => (
                  <div key={banner.id} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-12 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden border">
                        {banner.image ? (
                          <img 
                            src={getImageUrl(banner.image)} 
                            alt="Banner preview" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                const fallback = parent.querySelector('.fallback-icon') as HTMLElement;
                                if (fallback) {
                                  fallback.style.display = 'block';
                                }
                              }
                            }}
                          />
                        ) : null}
                        <ImageIcon className="w-6 h-6 text-muted-foreground fallback-icon" style={{ display: banner.image ? 'none' : 'block' }} />
                      </div>
                      <div>
                        <p className="font-medium">Banner #{banner.id}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[300px]">
                          {banner.image}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            banner.isActive 
                              ? 'bg-success/10 text-success' 
                              : 'bg-muted text-muted-foreground'
                          }`}>
                            {banner.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon-sm" onClick={() => openEditDialog(banner)}>
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon-sm" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => confirmDeleteBanner(banner)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Banner Dialog */}
        <Dialog open={!!selectedBanner} onOpenChange={() => setSelectedBanner(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Banner</DialogTitle>
              <DialogDescription>Update banner settings</DialogDescription>
            </DialogHeader>
            {selectedBanner && (
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Upload New Image File</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      type="file"
                      accept="image/*"
                      onChange={handleEditFileSelect}
                      className="flex-1"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        const fileInput = document.querySelector<HTMLInputElement>('input[type="file"]:last-of-type');
                        fileInput?.click();
                      }}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose File
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Select a new image file to replace the current one
                  </p>
                </div>
                
                <div className="text-center text-sm text-muted-foreground">
                  — OR —
                </div>
                
                <div className="space-y-2">
                  <Label>Image URL</Label>
                  <Input 
                    placeholder="https://example.com/banner.jpg" 
                    value={editBannerData.image}
                    onChange={(e) => {
                      setEditBannerData(prev => ({ ...prev, image: e.target.value }));
                      if (e.target.value) {
                        setEditSelectedFile(null);
                        setEditPreviewUrl("");
                      }
                    }}
                    disabled={!!editSelectedFile}
                  />
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg border">
                  <div>
                    <Label>Active Status</Label>
                    <p className="text-sm text-muted-foreground">Show this banner in the onboarding flow</p>
                  </div>
                  <Switch 
                    checked={editBannerData.isActive}
                    onCheckedChange={(checked) => setEditBannerData(prev => ({ ...prev, isActive: checked }))}
                  />
                </div>
                
                {/* Preview */}
                {(editPreviewUrl || editBannerData.image || selectedBanner.image) && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <div className="w-full h-32 rounded-lg bg-muted/50 flex items-center justify-center overflow-hidden border">
                      <img 
                        src={editPreviewUrl || editBannerData.image || getImageUrl(selectedBanner.image)} 
                        alt="Banner preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="text-muted-foreground text-center">
                                <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <p class="text-sm">Failed to load image</p>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setSelectedBanner(null);
                setEditBannerData({ image: "", isActive: true });
                setEditSelectedFile(null);
                setEditPreviewUrl("");
              }}>Cancel</Button>
              <Button 
                variant="dental" 
                onClick={handleUpdateBanner}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  "Update Banner"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Banner Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this banner? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => bannerToDelete && handleDeleteBanner(bannerToDelete.id)}
              >
                Delete Banner
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default OnboardingSettingsPage;
