#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_PRODUCTS 100

typedef struct {
    int id;
    char name[50];
    int quantity;
    float price;
} Product;

void addProduct();
void updateStock();
void displayStock();
void searchProduct();
void deleteProduct();

int main() {
    int choice;
    while (1) {
        printf("\nStock Management System\n");
        printf("1. Add Product\n");
        printf("2. Update Stock\n");
        printf("3. Display Stock\n");
        printf("4. Search Product\n");
        printf("5. Delete Product\n");
        printf("6. Exit\n");
        printf("Enter your choice: ");
        scanf("%d", &choice);
        switch (choice) {
            case 1: addProduct(); break;
            case 2: updateStock(); break;
            case 3: displayStock(); break;
            case 4: searchProduct(); break;
            case 5: deleteProduct(); break;
            case 6: exit(0);
            default: printf("Invalid choice! Try again.\n");
        }
    }
    return 0;
}

void addProduct() {
    FILE *file = fopen("stock.dat", "ab");
    if (!file) {
        printf("Error opening file!\n");
        return;
    }
    Product p;
    printf("Enter Product ID: ");
    scanf("%d", &p.id);
    printf("Enter Product Name: ");
    scanf("%s", p.name);
    printf("Enter Quantity: ");
    scanf("%d", &p.quantity);
    printf("Enter Price: ");
    scanf("%f", &p.price);
    fwrite(&p, sizeof(Product), 1, file);
    fclose(file);
    printf("Product added successfully!\n");
}

void updateStock() {
    FILE *file = fopen("stock.dat", "rb+");
    if (!file) {
        printf("No stock available!\n");
        return;
    }
    int id, newQty, found = 0;
    Product p;
    printf("Enter Product ID to update: ");
    scanf("%d", &id);
    while (fread(&p, sizeof(Product), 1, file)) {
        if (p.id == id) {
            found = 1;
            printf("Enter new quantity: ");
            scanf("%d", &newQty);
            p.quantity = newQty;
            fseek(file, -sizeof(Product), SEEK_CUR);
            fwrite(&p, sizeof(Product), 1, file);
            break;
        }
    }
    fclose(file);
    if (found) printf("Stock updated successfully!\n");
    else printf("Product not found!\n");
}

void displayStock() {
    FILE *file = fopen("stock.dat", "rb");
    if (!file) {
        printf("No stock available!\n");
        return;
    }
    Product p;
    printf("\nAvailable Stock:\n");
    printf("ID\tName\tQuantity\tPrice\n");
    while (fread(&p, sizeof(Product), 1, file)) {
        printf("%d\t%s\t%d\t%.2f\n", p.id, p.name, p.quantity, p.price);
    }
    fclose(file);
}

void searchProduct() {
    FILE *file = fopen("stock.dat", "rb");
    if (!file) {
        printf("No stock available!\n");
        return;
    }
    int id, found = 0;
    Product p;
    printf("Enter Product ID to search: ");
    scanf("%d", &id);
    while (fread(&p, sizeof(Product), 1, file)) {
        if (p.id == id) {
            printf("Product Found!\n");
            printf("ID: %d\nName: %s\nQuantity: %d\nPrice: %.2f\n", p.id, p.name, p.quantity, p.price);
            found = 1;
            break;
        }
    }
    fclose(file);
    if (!found) printf("Product not found!\n");
}

void deleteProduct() {
    FILE *file = fopen("stock.dat", "rb");
    if (!file) {
        printf("No stock available!\n");
        return;
    }
    FILE *temp = fopen("temp.dat", "wb");
    if (!temp) {
        printf("Error creating temp file!\n");
        fclose(file);
        return;
    }
    int id, found = 0;
    Product p;
    printf("Enter Product ID to delete: ");
    scanf("%d", &id);
    while (fread(&p, sizeof(Product), 1, file)) {
        if (p.id == id) {
            found = 1;
            continue;
        }
        fwrite(&p, sizeof(Product), 1, temp);
    }
    fclose(file);
    fclose(temp);
    remove("stock.dat");
    rename("temp.dat", "stock.dat");
    if (found) printf("Product deleted successfully!\n");
    else printf("Product not found!\n");
}
