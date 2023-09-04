import { PrismaService } from "../../src/prisma/prisma.service";

export class BaseFactory {
  protected static prisma: PrismaService = new PrismaService();

  static async cleanDb() {
    await this.prisma.credential.deleteMany();
    await this.prisma.note.deleteMany();
    await this.prisma.card.deleteMany();
    await this.prisma.wifi.deleteMany();
    await this.prisma.licence.deleteMany();
    await this.prisma.user.deleteMany();
  }
}