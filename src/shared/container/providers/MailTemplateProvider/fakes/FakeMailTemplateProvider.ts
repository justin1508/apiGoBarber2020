import IMailTemplateProvider from '../models/IMailTemplateProvider';

class FakeMailTemplateProvider implements IMailTemplateProvider {
    public async parse(): Promise<string> {
        return 'mail contetnt';
    }
}

export default FakeMailTemplateProvider;
