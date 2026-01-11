import React from "react";
import { AdminHeader } from "./admin-header";
import { FormWrapper } from "./form-wrapper";
import LoadingSpinner from "./loading-spinner";
import ErrorBox from "./error";
import EmptyListPlaceholder from "./empty-list-placeholder";

interface AdminCrudPageProps<T> {
  title: string;
  description: string;
  createButtonText: string;
  emptyText: string;
  loadingText: string;
  data?: T[];
  isLoading: boolean;
  error: Error | null;
  showCreateForm: boolean;
  editingItemId: string | null;
  onToggleCreateForm: () => void;
  onCancelEdit: () => void;
  renderCreateForm: () => React.ReactNode;
  renderEditForm: (id: string) => React.ReactNode;
  renderItem: (item: T) => React.ReactNode;
}

export function AdminCrudPage<T extends { id: string }>({
  title,
  description,
  createButtonText,
  emptyText,
  loadingText,
  data,
  isLoading,
  error,
  showCreateForm,
  editingItemId,
  onToggleCreateForm,
  onCancelEdit,
  renderCreateForm,
  renderEditForm,
  renderItem,
}: AdminCrudPageProps<T>) {
  if (isLoading) return <LoadingSpinner text={loadingText} />;
  if (error) return <ErrorBox message={error.message} />;
  
  if (data && data.length === 0) {
    return (
      <div className="w-full">
        <EmptyListPlaceholder text={emptyText} />
        {renderCreateForm()}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 sm:space-y-6">
      <AdminHeader
        title={title}
        description={description}
        buttonText={createButtonText}
        showForm={showCreateForm}
        onToggleForm={onToggleCreateForm}
      />

      {showCreateForm && (
        <FormWrapper>{renderCreateForm()}</FormWrapper>
      )}

      {editingItemId && (
        <FormWrapper title="Edit" onCancel={onCancelEdit}>
          {renderEditForm(editingItemId)}
        </FormWrapper>
      )}

      <div className="space-y-4">
        {data?.map((item) => (
          <React.Fragment key={item.id}>
            {renderItem(item)}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
