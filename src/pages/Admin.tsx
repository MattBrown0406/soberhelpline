import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { ArrowLeft, Pencil, CheckCircle, XCircle, BarChart3, Users, FileText, Video, CalendarCheck, UserPlus, Film, ClipboardList, MailWarning, Filter, Route } from "lucide-react";
import { ProviderSubmission } from "@/types/provider";
import { EditSubmissionDialog } from "@/components/admin/EditSubmissionDialog";
import { ProviderAnalytics } from "@/components/admin/ProviderAnalytics";
import { FamilyMemberManagement } from "@/components/admin/FamilyMemberManagement";
import { GuideAnalytics } from "@/components/admin/GuideAnalytics";
import { ZoomLinkSettings } from "@/components/admin/ZoomLinkSettings";
import { ConsultationManagement } from "@/components/admin/ConsultationManagement";
import ConsultationProviderCreator from "@/components/admin/ConsultationProviderCreator";
import { RecordingManagement } from "@/components/admin/RecordingManagement";
import { SurveyManagement } from "@/components/admin/SurveyManagement";
import { AbandonedBookingsManagement } from "@/components/admin/AbandonedBookingsManagement";
import { LeadPipelineManagement } from "@/components/admin/LeadPipelineManagement";
import { NmeFunnelReport } from "@/components/admin/NmeFunnelReport";

const Admin = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<ProviderSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [editingSubmission, setEditingSubmission] = useState<ProviderSubmission | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Please log in to access the admin dashboard");
        navigate("/auth");
        return;
      }

      // Check if user has admin role
      const { data: roleData, error: roleError } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (roleError) {
        console.error("Error checking admin role:", roleError);
        toast.error("Error verifying admin access");
        navigate("/");
        return;
      }

      if (!roleData) {
        toast.error("You don't have admin access");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      fetchSubmissions();
    } catch (error) {
      console.error("Error checking admin access:", error);
      toast.error("Error verifying access");
      navigate("/");
    }
  };

  const fetchSubmissions = async () => {
    try {
      const { data, error } = await supabase
        .from("provider_submissions")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("provider_submissions")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) throw error;

      toast.success(`Status updated to ${newStatus}`);
      fetchSubmissions();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleEdit = (submission: ProviderSubmission) => {
    setEditingSubmission(submission);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async (updatedSubmission: ProviderSubmission) => {
    try {
      const { id, created_at, updated_at, ...updateData } = updatedSubmission;
      
      const { error } = await supabase
        .from("provider_submissions")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      toast.success("Provider submission updated successfully");
      setEditDialogOpen(false);
      fetchSubmissions();
    } catch (error) {
      console.error("Error updating submission:", error);
      toast.error("Failed to update submission");
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "secondary",
      approved: "default",
      rejected: "destructive",
      draft: "outline",
    };
    const labels: Record<string, string> = {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      draft: "Draft",
    };
    return <Badge variant={variants[status] || "default"}>{labels[status] || status}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl sm:text-3xl font-bold">Admin Dashboard</h1>
        </div>

        <Tabs defaultValue="submissions" className="space-y-6">
          <TabsList className="flex-wrap h-auto gap-1">
            <TabsTrigger value="submissions">Provider Submissions</TabsTrigger>
            <TabsTrigger value="family-members" className="gap-2">
              <Users className="h-4 w-4" />
              Family Members
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Click Analytics
            </TabsTrigger>
            <TabsTrigger value="nme-funnel" className="gap-2">
              <Route className="h-4 w-4" />
              NME Funnel
            </TabsTrigger>
            <TabsTrigger value="guide-analytics" className="gap-2">
              <FileText className="h-4 w-4" />
              Guide Analytics
            </TabsTrigger>
            <TabsTrigger value="zoom-settings" className="gap-2">
              <Video className="h-4 w-4" />
              Zoom Meeting
            </TabsTrigger>
            <TabsTrigger value="consultations" className="gap-2">
              <CalendarCheck className="h-4 w-4" />
              Consultations
            </TabsTrigger>
            <TabsTrigger value="abandoned-bookings" className="gap-2">
              <MailWarning className="h-4 w-4" />
              Abandoned Bookings
            </TabsTrigger>
            <TabsTrigger value="lead-pipeline" className="gap-2">
              <Filter className="h-4 w-4" />
              Lead Pipeline
            </TabsTrigger>
            <TabsTrigger value="add-provider" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Add Provider
            </TabsTrigger>
            <TabsTrigger value="recordings" className="gap-2">
              <Film className="h-4 w-4" />
              Recordings
            </TabsTrigger>
            <TabsTrigger value="surveys" className="gap-2">
              <ClipboardList className="h-4 w-4" />
              Surveys
            </TabsTrigger>
          </TabsList>

          <TabsContent value="submissions">
            <Card>
              <CardHeader>
                <CardTitle>Provider Submissions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Provider Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{submission.provider_name}</span>
                          {submission.cip_certified && (
                            <Badge variant="secondary" className="w-fit mt-1 text-xs">
                              CIP Certified
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{submission.category}</TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          {submission.city && submission.state ? (
                            <>
                              <span>{submission.city}, {submission.state}</span>
                              {submission.zip_code && <span className="text-muted-foreground">{submission.zip_code}</span>}
                            </>
                          ) : (
                            <span>{submission.state || "N/A"}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm">
                          <span>{submission.email}</span>
                          <span className="text-muted-foreground">{submission.phone_number}</span>
                          {submission.website && (
                            <a href={submission.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs">
                              Website
                            </a>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col text-sm space-y-1">
                          {submission.cost && <span>Cost: {submission.cost}</span>}
                          {submission.year_started && <span>Since: {submission.year_started}</span>}
                          
                          {/* Interventionist-specific fields */}
                          {submission.category === "Interventionists" && (
                            <>
                              {submission.intervention_modalities && submission.intervention_modalities.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                  {submission.intervention_modalities.map((modality, idx) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {modality}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                              {submission.travel_expenses_included && (
                                <Badge variant="outline" className="w-fit text-xs">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Travel Included
                                </Badge>
                              )}
                            </>
                          )}
                          
                          {submission.detox_available && (
                            <Badge variant="outline" className="w-fit text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Detox
                            </Badge>
                          )}
                          {submission.lgbt_supportive && (
                            <Badge variant="outline" className="w-fit text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              LGBT Supportive
                            </Badge>
                          )}
                          {submission.license_current_good_standing && (
                            <Badge variant="outline" className="w-fit text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Licensed
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(submission.status || "pending")}</TableCell>
                      <TableCell>
                        {new Date(submission.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(submission)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Select
                            value={submission.status || "pending"}
                            onValueChange={(value) =>
                              updateStatus(submission.id, value)
                            }
                          >
                            <SelectTrigger className="w-32 bg-background">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-background z-50">
                              <SelectItem value="draft">Draft</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {submissions.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No provider submissions found
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          <TabsContent value="family-members">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Family Member Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FamilyMemberManagement />
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Provider Click Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProviderAnalytics />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="nme-funnel">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Route className="h-5 w-5" />
                  NME Bridge Funnel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <NmeFunnelReport />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guide-analytics">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Guide Usage Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <GuideAnalytics />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="zoom-settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Video className="h-5 w-5" />
                  “The Family Squares” Zoom Meeting Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ZoomLinkSettings />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="consultations">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarCheck className="h-5 w-5" />
                  Consultation Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ConsultationManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="abandoned-bookings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MailWarning className="h-5 w-5" />
                  Abandoned Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <AbandonedBookingsManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lead-pipeline">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Family Lead Pipeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <LeadPipelineManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="add-provider">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="h-5 w-5" />
                  Add Consultation Provider
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ConsultationProviderCreator />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recordings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  Zoom Recording Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecordingManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="surveys">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Monthly Survey Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SurveyManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <EditSubmissionDialog
          submission={editingSubmission}
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          onSave={handleSaveEdit}
        />
      </div>
    </div>
  );
};

export default Admin;
